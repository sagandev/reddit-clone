import $ from 'jquery';
import { useEffect, useState } from "react";
import {
  AppShell,
  Modal,
  rem, Text, Flex, Grid, Container, SegmentedControl, Center, Loader
} from "@mantine/core";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import {
 IconClock12, IconChevronsUp, IconFlame
} from "@tabler/icons-react";
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
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/posts?sort=created_at"
    }).done((res) => {
      setPosts(res.data);
      console.log(res)
    })

    $.ajax({
      method: "GET",
      url: "http://localhost:3000/communities"
    }).done((res) => {
      setCommunities(res.data)
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
                <SegmentedControl mb="lg"
                  data={[
                    {
                      value: 'New',
                      label: (
                        <Center style={{ gap: 10 }}>
                          <IconClock12 style={{ width: rem(16), height: rem(16) }} />
                          <span>New</span>
                        </Center>
                      ),
                    },
                    {
                      value: 'Top',
                      label: (
                        <Center style={{ gap: 10 }}>
                          <IconChevronsUp style={{ width: rem(16), height: rem(16) }} />
                          <span>Top</span>
                        </Center>
                      ),
                    },
                    {
                      value: 'Hot',
                      label: (
                        <Center style={{ gap: 10 }}>
                          <IconFlame style={{ width: rem(16), height: rem(16) }} />
                          <span>Hot</span>
                        </Center>
                      ),
                    },
                  ]}
                />
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
