import {
  Group,
  Button,
  Autocomplete,
  rem,
  Menu, Box, Flex, Avatar
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";

import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconDots, IconTrash, IconPlus
} from "@tabler/icons-react";
export default function Navbar({isLogged, openedLogin, toggleLogin, openedSignup, toggleSignup}) {
    return (
        <>
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
                    radius="xl"
                    style={{ width: "50%" }}
                />
                <Group>
                    {
                        isLogged ? <>
                            <Button
                                variant="light"
                                radius="xl"
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
                                Create
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
        </>
    )
}