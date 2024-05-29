import axios from "axios";
import { useEffect, useState } from "react";
import {
  AppShell,
  Modal,
  Text,
  Flex,
  Grid,
  Container,
  Center,
  Button,
  Image,
  Avatar,
  Divider,
  Anchor,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import PostBox from "../../components/Post";
import Navbar from "../../components/Navbar";
import UserCard from "../../components/UserCard";
import { Cookies } from "react-cookie";
import Loading from "../../components/Loading";
import Sidebar from "../../components/Sidebar";
import config from  "../../config";
export default function UserPage() {
  const params = useParams();
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState([]);
  const [userLocal, setUserLocal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, { toggle }] = useDisclosure();
  const cookies = new Cookies();
  useEffect(() => {
    const sessionId = cookies.get("sessionId");
    axios
      .get(
        `${config.apiServer}/posts?sort=created_at&sessionId=${sessionId}&userName=${params.username}`, {withCredentials: true}
      )
      .then((res) => {
        setPosts(res.data.data.posts);
      });
    axios.get(`${config.apiServer}/users/${params.username}`).then((res) => {
      setUser(res.data.data);
      console.log(res.data.data);
      setLoading(false);
    });
    const auth = cookies.get("auth");
    if (auth) {
      setIsLogged(true);
    }
    const user = localStorage.getItem("user") ?? null;
    console.log(JSON.parse(user));
    if (user) setUserLocal(JSON.parse(user));
  }, []);
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
          navbar={userLocal ? {
            width: 250,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }:null}
        >
          <AppShell.Header>
            <Navbar
              isLogged={isLogged}
              openedLogin={openedLogin}
              toggleLogin={toggleLogin}
              openedSignup={openedSignup}
              toggleSignup={toggleSignup}
              user={userLocal}
            />
          </AppShell.Header>
          {user ? <Sidebar user={userLocal} /> : null}
          <AppShell.Main>
            {user?.username ? (
              <>
                <Container size="lg" px={0}>
                  <Flex direction="column" h={300} gap={5}>
                    <Image
                      radius="md"
                      h={200}
                      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png"
                    />
                    <Flex direction="row" gap={5}>
                      <Avatar
                        src={`${config.cdn}${
                          user.avatar
                            ? "/users/" + user.avatar
                            : "/Default_avatar_profile.jpg"
                        }`}
                        size="xl"
                        style={{ transform: "translate3d(+25%, -50%, 0)" }}
                        mr={30}
                      >
                        MK
                      </Avatar>
                      <Text fw="bold" size="xl">
                        u/{params.username}
                      </Text>
                      {user.id == userLocal.id ? (
                        <Button
                          variant="outline"
                          color="gray"
                          radius="lg"
                          style={{ marginLeft: "auto" }}
                        >
                          Edit profile
                        </Button>
                      ) : null}
                    </Flex>
                  </Flex>
                  <Divider pb={10} />
                  <Grid>
                    <Grid.Col span="auto">
                      {posts ? (
                        posts.map((el, i) => {
                          return <PostBox post={el} key={i} />;
                        })
                      ) : (
                        <Text>No post has been added yet...</Text>
                      )}
                      <Center></Center>
                    </Grid.Col>
                  </Grid>
                  <UserCard user={user} />
                </Container>
              </>
            ) : (
              <>
                <Text>This user not exists</Text>{" "}
                <Anchor href={config.clientAddr}>go back home</Anchor>
              </>
            )}
          </AppShell.Main>
        </AppShell>
      </>
    );
}
