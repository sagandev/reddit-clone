import {
  Group,
  Text,
  Flex,
  Avatar,
  Divider,
  Stack,
  Menu,
  Button,
  rem,
} from "@mantine/core";
import {
  IconTrash,
  IconDotsVertical,
  IconArrowAutofitHeight,
  IconChecks,
  IconX,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import config from  "../../config";
const cookies = new Cookies();
const handleDelete = (comment) => {
  console.log(comment);
  const auth = cookies.get("auth");
  axios
    .delete(`${config.apiServer}/comments/${comment.id}`, {
      withCredentials: true,
      headers: { Authorization: "Bearer " + auth },
    })
    .then((res) => {
      console.log(res);
      if (res.status == 200) {
        notifications.show({
          title: "Comment deleted successfully",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconChecks />,
        });
      } else {
        notifications.show({
          title: "Deleting comment failed",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconX />,
        });
      }
    });
};
export default function Comment({ comment, user }) {
  const navigate = useNavigate();
  return (
    <>
      <Flex shadow="xs" direction="column" gap={5} mt={5}>
        <Flex direction="row" align="center" gap="xs" justify="space-between">
          <Group>
            <Avatar
              component="a"
              target="_blank"
              src={`${config.cdn}${
                comment.avatar ? "/users/" + comment.avatar : "/Default_avatar_profile.jpg"
              }`}
              alt="it's me"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/user/${comment.author_name}`)}
            />
            <Stack gap={0}>
              <Flex
                direction="row"
                align="center"
                justify="space-around"
                gap="xs"
              >
                <Text
                  size="md"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/user/${comment.author_name}`)}
                >
                  {comment.author_name}
                </Text>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-point-filled"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#000000"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z"
                    strokeWidth="0"
                    fill="currentColor"
                  />
                </svg>
                <Text size="xs">{comment.timestamp}</Text>
              </Flex>
            </Stack>
          </Group>
          <Menu shadow="md" width={200}>
            {comment.author_id == user?.user.id ? (
              <Menu.Target>
                <Button variant="transparent" radius="full" size="xs">
                  <IconDotsVertical />
                </Button>
              </Menu.Target>
            ) : null}

            <Menu.Dropdown>
              {}
              <Menu.Item
                color="red"
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={() => handleDelete(comment)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        <Text>{comment.content}</Text>
      </Flex>
      <Divider my="sm" />
    </>
  );
}
