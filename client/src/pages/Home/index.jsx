import axios from "axios";
import { useEffect, useState } from "react";
import {
  AppShell,
  Modal,
  rem,
  Text,
  Flex,
  Grid,
  Container,
  SegmentedControl,
  Center,
  Loader,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import PostBox from "../../components/Post";
import CommunitySmallCard from "../../components/Community";
import Navbar from "../../components/Navbar";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Sidebar from "../../components/Sidebar";
export default function HomePage() {
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, { toggle }] = useDisclosure();
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = cookies.get("sessionId");

    axios
      .get(`http://localhost:3000/posts?sort=created_at&sessionId=${sessionId}`)
      .then((res) => {
        setPosts(res.data.data.posts);
        setPostsCount(res.data.data.posts.length);
        if (res.data.data.sessionId && !sessionId) {
          cookies.set("sessionId", res.data.data.sessionId, {
            expires: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
            path: "/",
          });
        }
      });

    axios
      .get("http://localhost:3000/communities")
      .then((res) => {
        setCommunities(res.data.data);
        console.log(res.data.data)
      })
      .then(() => {
        setLoading(false);
      });

    const auth = cookies.get("auth");
    if (auth) {
      setIsLogged(true);
      const user = localStorage.getItem("user") ?? null;
      if (user) setUser(JSON.parse(user));
    } else {
      if (localStorage.getItem("user")) localStorage.removeItem("user");
    }
  }, []);

  const handleLoadMore = () => {
    const sessionId = cookies.get("sessionId");
    console.log(postsCount);
    axios
      .get(
        `http://localhost:3000/posts?sort=created_at&sessionId=${sessionId}&fromPost=${postsCount}`
      )
      .then((res) => {
        setPosts([...posts, ...res.data.data.posts]);
        console.log(res.data.data.posts);
        setPostsCount(postsCount + res.data.data.posts.length);
      });
  };
  if (loading) {
    return <Loading />;
  } else {
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
            width: 250,
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
          {user?.user?.username ? <Sidebar user={user} /> : null}
          <AppShell.Main>
            <Container size="lg" px={0}>
              <Grid>
                <Grid.Col span="auto">
                  {posts.length > 0 ? (
                    posts.map((el, i) => {
                      return <PostBox post={el} key={i} />;
                    })
                  ) : (
                    <Loader color="blue" type="dots" />
                  )}
                  <Center>
                    <Button
                      variant="transparent"
                      onClick={() => handleLoadMore()}
                    >
                      Load more
                    </Button>
                  </Center>
                </Grid.Col>
                <Grid.Col span={3} visibleFrom="md">
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
                    <Text tt="uppercase" size="xs" fw={600}>
                      Popular communities
                    </Text>
                    {communities ? (
                      communities.map((val, i) => (
                        <CommunitySmallCard data={val} key={i} />
                      ))
                    ) : (
                      <Loader color="blue" type="dots" />
                    )}
                  </Flex>
                </Grid.Col>
              </Grid>
            </Container>
          </AppShell.Main>
        </AppShell>
      </>
    );
  }
}
