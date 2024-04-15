import axios from 'axios';
import { useEffect, useState } from "react";
import {
  AppShell,
  Modal,
  rem, Text, Flex, Grid, Container, SegmentedControl, Center, Loader, Button
} from "@mantine/core";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import PostBox from "../../components/post";
import CommunitySmallCard from "../../components/community";
import Navbar from "../../components/navbar";
import { Cookies } from 'react-cookie';
export default function HomePage() {
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const cookies = new Cookies();
  useEffect(() => {
    const sessionId = cookies.get("sessionId");

    axios.get(`http://localhost:3000/posts?sort=created_at&sessionId=${sessionId}`).then((res) => {
      setPosts(res.data.data.posts);
      setPostsCount(res.data.data.posts.length);
      if (res.data.data.sessionId && !sessionId) {
        cookies.set("sessionId", res.data.data.sessionId, { expires: new Date(new Date().getTime() + (((12 * 60) * 60)) * 1000), path: "/" })
      }
    })

    axios.get("http://localhost:3000/communities").then((res) => {
      setCommunities(res.data.data)
    })

    const auth = cookies.get('auth');
    if (auth) {
      setIsLogged(true);
    }
  }, [])

  const handleLoadMore = () => {
    const sessionId = cookies.get("sessionId");
    console.log(postsCount)
    axios.get(`http://localhost:3000/posts?sort=created_at&sessionId=${sessionId}&fromPost=${postsCount}`).then((res) => {
        setPosts([...posts, ...res.data.data.posts]);
        console.log(res.data.data.posts)
        setPostsCount(postsCount + res.data.data.posts.length);
    })
  }

  return (
    <>
      <Modal opened={openedLogin} onClose={() => toggleLogin(!openedLogin)} title="Log in" centered>
        <Login toggleLogin={toggleLogin} openedLogin={openedLogin} />
      </Modal>
      <Modal
        opened={openedSignup}
        onClose={() => toggleSignup(!openedSignup)}
        title="Sign up"
        centered
      >
        <Signup />
      </Modal>
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
          <Navbar isLogged={isLogged} openedLogin={openedLogin} toggleLogin={toggleLogin} openedSignup={openedSignup} toggleSignup={toggleSignup}/>
        </AppShell.Header>
        <AppShell.Main>
          <Container size="lg" px={0}>
            <Grid>
              <Grid.Col span="auto">
                {
                  posts.length > 0 ? posts.map((el, i) => { return <PostBox post={el} key={i}/> }) : <Loader color="blue" type="dots" />
                }
                <Center>
                <Button variant="transparent" onClick={() => handleLoadMore()}>Load more</Button>
                </Center>
              </Grid.Col>
              <Grid.Col span={3} visibleFrom="md">
                <Flex ml="sm" direction="column" gap="sm" p="lg" style={{ backgroundColor: "var(--mantine-color-dark-6)", borderRadius: "var(--mantine-radius-md)" }}>
                  <Text tt="uppercase" size="xs" fw={600}>Popular communities</Text>
                  {
                    communities ? communities.map((val, i) => <CommunitySmallCard data={val} key={i}/>) : <Loader color="blue" type="dots" />
                  }
                </Flex>
              </Grid.Col>
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
