import axios from "axios";
import $ from "jquery";
import { useEffect, useState, useCallback } from "react";
import {
  AppShell,
  Modal,
  rem,
  Text,
  Flex,
  Grid,
  Container,
  List,
  Divider,
  Select,
  Tabs,
  Chip,
  Group,
  Input,
  Textarea,
  Button,
  InputDescription,
} from "@mantine/core";
import { useDropzone } from "react-dropzone";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
  IconX,
  IconUpload,
  IconChecks
} from "@tabler/icons-react";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import Navbar from "../../components/Navbar";
import { Cookies } from "react-cookie";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import "./index.css";
export default function SubmitPage() {
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [community, setCommunity] = useState([]);
  const [NSFW, toggleNSFW] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState();
  const cookies = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    const auth = cookies.get("auth");
    if (auth) {
      setIsLogged(true);
    }
    if (!auth) {
      navigate("/");
      return;
    }
    const userS = JSON.parse(localStorage.getItem("user"));
    if (userS) setUser(userS);
    axios
      .get(`http://localhost:3000/users/${userS.user.username}/communities`)
      .then((res) => {
        setCommunities(res.data.data);
        console.log(res.data.data);
      });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 20000000,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const iconStyle = { width: rem(12), height: rem(12) };

  const handleSubmit = () => {
    if (!community || isNaN(community) || !title || title.length < 2) {
      return;
    }
    const form = new FormData();
    form.append("communityId", community);
    form.append("title", title);
    form.append("content", content);
    form.append("nsfw", NSFW);

    if (acceptedFiles[0]) {
      if (
        acceptedFiles[0].type != "image/jpeg" &&
        acceptedFiles[0].type != "image/png"
      ) {
        return notifications.show({
          title: "Invalid file type",
          message: "The file must be JPEG or PNG type",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconX />,
        });
      }

      if (acceptedFiles[0].size > 20971520) {
        return notifications.show({
          title: "Invalid file size",
          message: "Selected file is too big. Max size size 20MB",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconX />,
        });
      }
      form.append("file", acceptedFiles[0]);
    }
    const auth = cookies.get("auth");
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post("http://localhost:3000/posts", form, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + auth,
          'X-CSRF-TOKEN': token
        },
        
      })
      .then((res) => {
        notifications.show({
          title: "Post created successfully",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconChecks />,
        });
        const community_ = communities.find(el => el.id = community);
        setTimeout(() => {
          navigate(`/r/${community_.name}/${res.data.data}`);
        }, 2000)
      }).catch(e => {
        notifications.show({
          title: "Post creating failed",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconX />,
        });
      });
  };
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
      <AppShell header={{ height: 60 }} padding="md">
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
        <AppShell.Main>
          <Container size="lg" px={0}>
            <Grid>
              <Grid.Col span="auto">
                <Flex direction="column" gap={5}>
                  <Flex direction="row" justify="space-between">
                    <Text fw={600} size="xl">
                      Create a post
                    </Text>
                  </Flex>
                  <Divider my={5} />
                  <Select
                    placeholder="Choose a community"
                    data={communities.map((val, i) => ({
                      value: val.id.toString(),
                      label: val.name,
                    }))}
                    w="50%"
                    mb={3}
                    onChange={setCommunity}
                  />
                  <Flex
                    direction="column"
                    style={{
                      backgroundColor: "var(--mantine-color-dark-6)",
                      borderRadius: "var(--mantine-radius-md)",
                    }}
                  >
                    <Tabs radius="xs" defaultValue="post">
                      <Tabs.List grow>
                        <Tabs.Tab
                          value="post"
                          leftSection={<IconPhoto style={iconStyle} />}
                        >
                          Post
                        </Tabs.Tab>
                        <Tabs.Tab
                          value="image"
                          leftSection={<IconMessageCircle style={iconStyle} />}
                        >
                          Image & Video
                        </Tabs.Tab>
                      </Tabs.List>

                      <Tabs.Panel value="post" p={5}>
                        <Flex direction="column" gap={10}>
                          <Textarea
                            placeholder="Title"
                            value={title}
                            maxLength="300"
                            withAsterisk
                            autosize
                            rightSection={
                              <Text size="xs" mr={10}>
                                {title.length}/300
                              </Text>
                            }
                            onChange={(e) => setTitle(e.target.value)}
                          ></Textarea>
                          <Textarea
                            placeholder="Text (optional)"
                            resize="vertical"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                          />
                        </Flex>
                      </Tabs.Panel>

                      <Tabs.Panel value="image" p={10}>
                        <section className="container-dropzone">
                          <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <p>
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                            <em>(Only JPEG and PNG images will be accepted)</em>
                          </div>
                          <aside>
                            <h4>Files</h4>
                            <ul>{files}</ul>
                          </aside>
                        </section>
                      </Tabs.Panel>
                    </Tabs>
                    <Flex direction="column" p={5} gap={10}>
                      <Group>
                        <Chip
                          icon={
                            <IconX
                              style={{ width: rem(16), height: rem(16) }}
                            />
                          }
                          color="red"
                          variant="filled"
                          onChange={() => toggleNSFW(!NSFW)}
                        >
                          NSFW
                        </Chip>
                      </Group>
                      <Divider />
                      <Flex direction="row" justify="flex-end">
                        <Button
                          variant="filled"
                          radius="md"
                          onClick={() => handleSubmit()}
                          disabled={community && title ? false : true}
                        >
                          Post
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Grid.Col>
              <Grid.Col span={4} visibleFrom="md">
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
                  <Text tt="uppercase" size="sm" fw={600}>
                    Posting to Reddot
                  </Text>
                  <List type="ordered">
                    <List.Item my={2}>Remember the human</List.Item>
                    <Divider />
                    <List.Item my={2}>
                      Behave like you would in real life
                    </List.Item>
                    <Divider />
                    <List.Item my={2}>
                      Look for the original source of content
                    </List.Item>
                    <Divider />
                    <List.Item my={2}>
                      Search for duplicates before posting
                    </List.Item>
                    <Divider />
                    <List.Item my={2}>Read the community’s rules</List.Item>
                    <Divider />
                  </List>
                </Flex>
              </Grid.Col>
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
