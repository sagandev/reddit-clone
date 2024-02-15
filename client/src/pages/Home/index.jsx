import { useState } from "react";
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
  Menu, Text, Box, Flex, Paper, Grid, Container, Stack, Avatar, Chip, Card, Anchor, Divider
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import {   IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight, IconDots, IconArrowBigUpFilled, IconArrowBigDownFilled, IconMessage2, IconShare3} from "@tabler/icons-react";
import PageBox from '../../components/post';
import PostBox from "../../components/post";
export default function HomePage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [openedBurger, { toggle }] = useDisclosure();
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
              style={{width: "50%"}}
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
              <PostBox post={'test'} />
              <PostBox post={'test'} />
              <PostBox post={'test'} />
              <PostBox post={'test'} />
              <PostBox post={'test'} />
            </Grid.Col>
            <Grid.Col span={3} visibleFrom="md">
                <Flex ml="sm" direction="column" gap="sm" p="lg" style={{backgroundColor: "var(--mantine-color-gray-0)", borderRadius: "var(--mantine-radius-lg)"}}>
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
