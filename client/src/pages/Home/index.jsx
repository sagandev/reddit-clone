import $ from 'jquery';
import { useEffect, useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  Skeleton,
  Modal,
  Button,
  Checkbox,
  ScrollArea,
  Autocomplete,
  rem,
  Menu, Text, Box, Flex, Paper, Grid, Container, Stack, Avatar, Chip, Card, Anchor, Divider, SegmentedControl, Center
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
 IconDots, IconClock12, IconChevronsUp,IconFlame 
} from "@tabler/icons-react";
import PostBox from "../../components/post";
export default function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/posts"
    }).done((data) => {
      setPosts(data.data);
    })
  }, [])

  return (
    <>
      <Modal opened={opened} onClose={close} title="Log in" centered>
        <LoginForm />
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
              <Button
                onClick={() => toggleSignup(!openedSignup)}
                variant="light"
                radius="lg"
                visibleFrom="sm"
              >
                Sign Up
              </Button>
              <Button onClick={open} radius="lg">
                Log In
              </Button>
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
                <PostBox post={'test'} />
                <PostBox post={'test'} />
                <PostBox post={'test'} />
                <PostBox post={'test'} />
                <PostBox post={'test'} />
              </Grid.Col>
              <Grid.Col span={3} visibleFrom="md">
                <Flex ml="sm" direction="column" gap="sm" p="lg" style={{ backgroundColor: "var(--mantine-color-gray-0)", borderRadius: "var(--mantine-radius-lg)" }}>
                  <Text tt="uppercase" size="xs" fw={600}>Popular communities</Text>
                  <Group>
                    <Avatar
                      component="a"
                      href="https://github.com/rtivital"
                      target="_blank"
                      src="avatar.png"
                      alt="it's me"
                    />
                    <Stack gap={0}>
                      <Text>r/Community</Text>
                      <Text size="xs" c="dimmed">45,080,234 members</Text>
                    </Stack>
                  </Group>
                  <Group>
                    <Avatar
                      component="a"
                      href="https://github.com/rtivital"
                      target="_blank"
                      src="avatar.png"
                      alt="it's me"
                    />
                    <Stack gap={0}>
                      <Text>r/Community</Text>
                      <Text size="xs" c="dimmed">45,080,234 members</Text>
                    </Stack>
                  </Group>
                  <Group>
                    <Avatar
                      component="a"
                      href="https://github.com/rtivital"
                      target="_blank"
                      src="avatar.png"
                      alt="it's me"
                    />
                    <Stack gap={0}>
                      <Text>r/Community</Text>
                      <Text size="xs" c="dimmed">45,080,234 members</Text>
                    </Stack>
                  </Group>
                </Flex>
              </Grid.Col>
            </Grid>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
