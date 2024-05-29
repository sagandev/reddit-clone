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
  Image,
  Avatar,
  Divider,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import PostBox from "../../components/Post";
import CommunitySmallCard from "../../components/Community";
import Navbar from "../../components/Navbar";
import { Cookies } from "react-cookie";
import Loading from "../../components/Loading";
import config from  "../../config";
export default function CommunityPage() {
  const params = useParams();
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState([]);
  const cookies = new Cookies();
  useEffect(() => {
    const sessionId = cookies.get("sessionId");
    axios
      .get(
        `${config.apiServer}/posts?sort=created_at&sessionId=${sessionId}&communityName=${params.community_name}`
      )
      .then((res) => {
        setPosts(res.data.data.posts);
        axios
          .get(
            `${config.apiServer}/communities/${params.community_name}`
          )
          .then((res) => {
            setCommunity(res.data.data);
            console.log(res.data.data);
          });
        setLoading(false);
      });
    const auth = cookies.get("auth");
    if (auth) {
      setIsLogged(true);
      const user = localStorage.getItem("user") ?? null;
      if (user) setUser(JSON.parse(user));
    }
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
              <Flex direction="column" h={300} gap={5}>
                <Image
                  radius="md"
                  h={200}
                  src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png"
                />
                <Flex direction="row" gap={5}>
                  <Avatar
                    src={`${config.cdn}${
                      community.icon ? "/communities/" + community.icon : "/communities/community.png"
                    }`}
                    size="xl"
                    style={{ transform: "translate3d(+25%, -50%, 0)" }}
                    mr={30}
                  >
                    MK
                  </Avatar>
                  <Text fw="bold" size="xl">
                    r/{params.community_name}
                  </Text>
                  {/*<Button variant="outline" color="gray" radius="lg" style={{marginLeft: "auto"}}>Create post</Button>*/}
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
            </Container>
          </AppShell.Main>
        </AppShell>
      </>
    );
}
