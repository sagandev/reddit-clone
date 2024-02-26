import $ from 'jquery';
import { useEffect, useState } from "react";
import {
  AppShell,
  Group,
  Modal,
  Button,
  Autocomplete,
  rem,
  Menu, Text, Box, Flex, Grid, Container, Stack, Avatar, SegmentedControl, Center, Loader, Switch, useMantineColorScheme
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconDots, IconClock12, IconChevronsUp, IconFlame, IconArrowsLeftRight, IconTrash, IconPlus
} from "@tabler/icons-react";
import PostBox from "../../components/post";
import CommunitySmallCard from "../../components/community";
export default function HomePage() {
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [checked, setChecked] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
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
    const auth = localStorage.getItem("auth");
    if (auth) {
      setIsLogged(true);
    }
  }, [])

  return (
    <>
      <Modal opened={openedLogin} onClose={() => toggleSignup(!openedLogin)} title="Log in" centered>
        <LoginForm toggleLogin={toggleLogin} openedLogin={openedLogin} />
      </Modal>
      <Modal
        opened={openedSignup}
        onClose={() => toggleSignup(!openedSignup)}
        title="Sign up"
        centered
      >
        <SignupForm />
      </Modal>
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
          <Flex h="100%" px="md" justify="space-between" align='center' gap='10'>
            <Box visibleFrom="md"><MantineLogo size={30}></MantineLogo></Box>
            <Autocomplete
              placeholder="Search"
              leftSection={
                <IconSearch
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
              data={[
                "React",
                "Angular",
                "Vue",
                "Next.js",
                "Riot.js",
                "Svelte",
                "Blitz.js",
              ]}
              radius="lg"
              style={{ width: "50%" }}
            />
            <Group>
              {
                isLogged ? <>
                  <Button
                    variant="light"
                    radius="lg"
                    visibleFrom="sm"
                    leftSection={<IconPlus />}
                  >
                    Create
                  </Button>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <Avatar radius="xl" style={{ cursor: "pointer" }} />
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Application</Menu.Label>
                      <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                        Settings
                      </Menu.Item>
                      <Menu.Item leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}>
                        Edit Avatar
                      </Menu.Item>
                      <Menu.Item leftSection={<IconPhoto style={{ width: rem(14), height: rem(14) }} />} rightSection={<Switch size="md" onLabel="ON" offLabel="OFF" checked={checked}
                        onChange={(event) => {setChecked(event.currentTarget.checked); toggleColorScheme()}} />}>
                        Dark Mode
                      </Menu.Item>

                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                      >
                        Log out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </> :
                  <>
                    <Button
                      onClick={() => toggleSignup(!openedSignup)}
                      variant="light"
                      radius="lg"
                      visibleFrom="sm"
                    >
                      Sign Up
                    </Button>
                    <Button onClick={() => toggleLogin(!openedLogin)} radius="lg">
                      Log In
                    </Button>
                  </>
              }
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button variant="transparent" hiddenFrom="sm"><IconDots></IconDots></Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconSettings
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                    onClick={() => toggleSignup(!openedSignup)}
                  >
                    Sign up
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconMessageCircle
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Messages
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Gallery
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Flex>
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
                  posts.length > 0 ? posts.map((el, i) => { return <PostBox post={el} key={i} /> }) : <Loader color="blue" type="dots" />
                }
              </Grid.Col>
              <Grid.Col span={3} visibleFrom="md">
                <Flex ml="sm" direction="column" gap="sm" p="lg" style={{ borderRadius: "var(--mantine-radius-lg)" }}>
                  <Text tt="uppercase" size="xs" fw={600}>Popular communities</Text>
                  {
                    communities ? communities.map((val, i) => <CommunitySmallCard data={val} />) : <Loader color="blue" type="dots" />
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
