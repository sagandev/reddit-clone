import axios from 'axios';
import { useEffect, useState } from "react";
import {
  AppShell,
  Modal,
  rem, Text, Flex, Grid, Container, SegmentedControl, Center, Loader
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
  const cookies = new Cookies();
  useEffect(() => {
    axios.get("http://localhost:3000/posts?sort=created_at").then((res) => {
      setPosts(res.data.data);
      console.log(res)
    })

    axios.get("http://localhost:3000/communities").then((res) => {
      setCommunities(res.data.data)
    })

    const auth = cookies.get('auth');
    if (auth) {
      setIsLogged(true);
    }
  }, [])

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
