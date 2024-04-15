import { useState } from 'react';
import {
  Group,
  Button,
  Autocomplete,
  rem,
  Menu, Box, Flex, Avatar, ActionIcon, Text
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useNavigate } from "react-router-dom";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconDots, IconTrash, IconPlus, IconToolsKitchen2
} from "@tabler/icons-react";
import { Cookies } from "react-cookie";
export default function Navbar({isLogged, openedLogin, toggleLogin, openedSignup, toggleSignup}) {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const handleLogout = () => {
        cookies.remove("auth");
        window.location.reload();
    }
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [search, setSearch] = useState('');
    const handleSearch = (value) => {
        if (value.length < 3) return;
        if (searchTimeout) clearTimeout(searchTimeout);

        const timeout = setTimeout(() =>{
            console.log("timeout")
        }, 2000)
        setSearchTimeout(timeout);
    }

    return (
        <>
            <Flex h="100%" px="md" justify="space-between" align='center' gap='10'>
                <Box visibleFrom="md" onClick={() => navigate("/")} style={{cursor: "pointer"}}>
                    <Text fw="bold" size="xl"><IconToolsKitchen2/> Reddish</Text>
                </Box>
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
                    radius="md"
                    style={{ width: "50%" }}
                    value={search}
                    onInput={(e) => {
                        setSearch(e.target.value);
                        handleSearch(e.target.value);
                    }}      
                />
                <Group>
                    {
                        isLogged ? <>
                            <Button
                                variant="light"
                                radius="md"
                                visibleFrom="sm"
                                leftSection={<IconPlus />}
                                onClick={() => navigate('/submit')}
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
                                        onClick={() => handleLogout()}
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
                                    radius="md"
                                    visibleFrom="sm"
                                >
                                    Sign Up
                                </Button>
                                <Button onClick={() => toggleLogin(!openedLogin)} radius="md">
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