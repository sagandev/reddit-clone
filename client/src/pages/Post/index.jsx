import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppShell,
  Modal,
  Text,
  Flex,
  Grid,
  Container,
  Loader,
  Button,
  CopyButton,
  Textarea,
  Pagination,
  Center,
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import PostPageBox from "../../components/PostPageBox";
import Navbar from "../../components/Navbar";
import Comment from "../../components/PostPageBox/comment";
import { Cookies } from "react-cookie";
import { useForm } from "@mantine/form";
import { IconSend, IconLink, IconX, IconChecks } from "@tabler/icons-react";
import Loading from "../../components/Loading";
import Sidebar from '../../components/Sidebar';
import {notifications} from '@mantine/notifications';
import config from  "../../config";
const commentsPaginated = (comments) => {
  const dataOnSinglePage = 10;
  const pages = Math.ceil(comments.length / dataOnSinglePage);
  let data = [];
  let rowPoint = 0;

  for (let i = 0; i < pages; i++) {
    let page = [];
    for (let j = rowPoint; j < rowPoint + dataOnSinglePage; j++) {
      if (j > comments.length - 1) break;
      page.push(comments[j]);
    }
    data.push(page);
    rowPoint += dataOnSinglePage;
  }

  return data;
};

export default function PostPage() {
  const params = useParams();
  const [isLogged, setIsLogged] = useState(false);
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState();
  const [newComments, setNewComments] = useState([]);
  const [community, setCommunity] = useState([]);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [blockType, setBlockType] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opened, { toggle }] = useDisclosure();
  const cookies = new Cookies();
  useEffect(() => {
    const auth = cookies.get("auth");
    if (auth) {
      setIsLogged(true);
    }
    axios
      .get(`${config.apiServer}/posts/${params.post_id}`, {
        headers: auth ? { Authorization: "Bearer " + auth } : null,
      })
      .then((res) => {
        setPost(res.data.data);
        const data = commentsPaginated(res.data.data.comments);
        setComments(data);
        console.log(res.data.data);
        axios
          .get(
            `${config.apiServer}/communities/${res.data.data.post.community_id}`
          )
          .then((res) => {
            setCommunity(res.data.data);
          });
        setLoading(false);
      });

    const user = localStorage.getItem("user") ?? null;
    console.log(JSON.parse(user));
    if (user) setUser(JSON.parse(user));
  }, []);
  const form = useForm({
    initialValues: {
      content: "",
    },

    validate: {
      content: (value) => (value.length > 3 ? null : "Invalid email"),
    },
  });
  const handleSubmit = (values) => {
    const auth = cookies.get("auth");
    if (!auth) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post(
        `${config.apiServer}/comments`,
        {
          content: values.content,
          postId: post.post.id,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + auth,
            'X-CSRF-TOKEN': token
          },
        }
      )
      .then((res) => {
        if (res.data.status == 200) {
          setNewComments([
            ...newComments,
            {
              id: res.data.data.id,
              author_id: res.data.data.author_id,
              post_id: res.data.data.post_id,
              content: res.data.data.content,
              author_name: user.user.username,
              avatar: user.user.avatar,
              timestamp: "now",
            },
          ]);
        }
      });
    setBlockType(true);
    setTimeout(() => {
      setBlockType(false);
    }, 3000);
  };

  const handleJoin = () => {
    const auth = cookies.get("auth");
    if (!auth) return;
    console.log(community)
    const token = cookies.get("CSRF_TOKEN");
    axios.post(`${config.apiServer}/communities/join`, {
      communityId: community.community.id,
    }, {
      withCredentials: true,
      headers: {
        Authorization: "Bearer " + auth,
        'X-CSRF-TOKEN': token
      }
    }).then((res) => {
      notifications.show({
        title: "Joined successfully",
        color: "green",
        withBorder: true,
        withCloseButton: false,
        radius: "md",
        icon: <IconChecks />,
      });
    }).catch((e) => {
      notifications.show({
        title: "Joining failed",
        message: e.response.data.message,
        color: "red",
        withBorder: true,
        withCloseButton: false,
        radius: "md",
        icon: <IconX />,
      });
    })
  }
  if (loading) {
    return <Loading />;
  } else
    return (
      <>
        <Modal
          opened={openedLogin}
          onClose={() => toggleLogin(!openedLogin)}
          title="Log in"
          centered
          radius="lg"
        >
          <Login toggleLogin={toggleLogin} openedLogin={openedLogin} />
        </Modal>
        <Modal
          opened={openedSignup}
          onClose={() => toggleSignup(!openedSignup)}
          title="Sign up"
          centered
          radius="lg"
        >
          <Signup />
        </Modal>
        <AppShell
          header={{ height: 60 }}
          padding="md"
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
        >
          <AppShell.Header>
            <Navbar
              isLogged={isLogged}
              openedLogin={openedLogin}
              toggleLogin={toggleLogin}
              openedSignup={openedSignup}
              toggleSignup={toggleSignup}
              user={user}
            />
          </AppShell.Header>
          {user ? <Sidebar user={user}/> : null}
          <AppShell.Main>
            <Container size="lg" px={0}>
              <Grid>
                <Grid.Col span="auto">
                  {post.post ? (
                    <PostPageBox post={post.post} isLogged={isLogged} />
                  ) : (
                    <Loader color="blue" type="dots" />
                  )}
                  <Flex shadow="xs" direction="column" gap={5}>
                    <form
                      onSubmit={form.onSubmit((values) => handleSubmit(values))}
                      style={{ display: "flex", flexDirection: "row", gap: 5 }}
                    >
                      <Textarea
                        radius="lg"
                        placeholder="Add comment"
                        disabled={!isLogged || blockType ? true : false}
                        style={{ flex: 1 }}
                        {...form.getInputProps("content")}
                        resize="vertical"
                      />
                      <Button
                        type="submit"
                        variant="blue"
                        color="gray"
                        radius="lg"
                        leftSection={<IconSend />}
                        disabled={!isLogged || blockType ? true : false}
                      >
                        Send
                      </Button>
                    </form>
                    {newComments
                      ? newComments.map((val, i) => (
                          <Comment comment={val} ey={i} />
                        ))
                      : null}
                    {comments?.length >= 1
                      ? comments[activePage - 1].map((val, i) => (
                          <Comment comment={val} user={user} key={i} />
                        ))
                      : null}
                  </Flex>
                  <Center>
                    {comments ? (
                      <Pagination
                        total={comments.length}
                        size="md"
                        radius="lg"
                        withControls={true}
                        value={activePage}
                        onChange={setActivePage}
                      />
                    ) : null}
                  </Center>
                </Grid.Col>
                <Grid.Col span={3} visibleFrom="md">
                  {post.post ? (
                    <Flex
                      ml="sm"
                      direction="column"
                      gap="sm"
                      p="lg"
                      style={{
                        backgroundColor: "var(--mantine-color-dark-6)",
                        borderRadius: "var(--mantine-radius-md)",
                      }}
                    >
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                      >
                        <Text fw={500} size="lg">
                          r/{post.post.community_name}
                        </Text>
                        <Button variant="filled" radius="lg" size="xs" onClick={() => handleJoin()}>
                          Join
                        </Button>
                      </Flex>
                      <Text>{community.community?.description}</Text>
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                      >
                        <Flex direction="column">
                          <Text size="sm">
                            {community.community?.members_count}
                          </Text>
                          <Text size="sm" c="dimmed">
                            Members
                          </Text>
                        </Flex>
                        <Flex direction="column">
                          <CopyButton
                            value={`${config.clientAddr}/r/${post.community_name}`}
                          >
                            {({ copied, copy }) => (
                              <Button
                                variant="transparent"
                                color="gray"
                                onClick={copy}
                                w="100%"
                                leftSection={<IconLink />}
                              >
                                {copied ? "Copied link" : "Copy link"}
                              </Button>
                            )}
                          </CopyButton>
                        </Flex>
                      </Flex>
                    </Flex>
                  ) : (
                    <Loader color="blue" type="dots" />
                  )}
                </Grid.Col>
              </Grid>
            </Container>
          </AppShell.Main>
        </AppShell>
      </>
    );
}
