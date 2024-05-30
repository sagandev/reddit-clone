import { useState } from "react";
import {
  Group,
  Button,
  Autocomplete,
  rem,
  Menu,
  Box,
  Flex,
  Avatar,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconSettings,
  IconSearch,
  IconDots,
  IconTrash,
  IconPlus,
  IconToolsKitchen2,
  IconUser,
  IconLogin2,
} from "@tabler/icons-react";
import { Cookies } from "react-cookie";
import axios from "axios";
import config from "../../config";
export default function Navbar({
  isLogged,
  openedLogin,
  toggleLogin,
  openedSignup,
  toggleSignup,
  user,
}) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const sendReq = () => {
    axios
      .get(`${config.apiServer}/communities?search=${search}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.data);
        const data = res.data.data;

        let d = [];

        data.map((val) => {
          d.push("r/" + val.name);
        });

        setSearchData(d);
        console.log(searchData);
      });
  };
  const timeout = () => {
    setSearchTimeout(setTimeout(sendReq, 2000));
  };
  const handleSearch = (value) => {
    if (value.length < 3) return;
    if (searchTimeout) clearTimeout(searchTimeout);

    timeout();
  };
  const handleLogout = () => {
    cookies.remove("auth");
    console.log(cookies);
    window.location.reload();
  };
  return (
    <>
      <Flex h="100%" px="md" justify="space-between" align="center" gap="10">
        <Flex onClick={() => navigate("/")} style={{ cursor: "pointer" }} align="center">
          <Text fw="bold" size="xl" visibleFrom="md">
            <IconToolsKitchen2 /> Reddish
          </Text>
          <Text hiddenFrom="md">
            <IconToolsKitchen2 />
          </Text>
        </Flex>
        <Autocomplete
          placeholder="Search"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          data={searchData}
          radius="lg"
          style={{ width: "50%" }}
          value={value}
          onInput={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          onChange={setValue}
          onOptionSubmit={(e) => navigate("/" + e)}
        />
        <Group>
          {isLogged ? (
            <>
              <Button
                variant="light"
                radius="lg"
                visibleFrom="sm"
                leftSection={<IconPlus />}
                onClick={() => navigate("/submit")}
              >
                Create
              </Button>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar
                    radius="xl"
                    src={config.cdn + "/users/" + user.user.avatar}
                    style={{ cursor: "pointer" }}
                  />
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>User</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconUser style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={() => navigate(`/user/${user.user.username}`)}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconSettings
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                    onClick={() => navigate(`/settings`)}
                  >
                    Settings
                  </Menu.Item>

                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={
                      <IconTrash style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={() => handleLogout()}
                  >
                    Log out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
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
          )}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="transparent" hiddenFrom="sm" px={2}>
                <IconDots></IconDots>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              {isLogged ? (
                <Menu.Item
                  leftSection={
                    <IconPlus style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={() => navigate("/submit")}
                >
                  Create
                </Menu.Item>
              ) : (
                <Menu.Item
                  onClick={() => toggleSignup(!openedSignup)}
                  leftSection={
                    <IconLogin2 style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Sign Up
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
    </>
  );
}
