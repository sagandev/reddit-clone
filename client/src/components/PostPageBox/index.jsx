import {
  Group,
  Button,
  rem,
  Text,
  Flex,
  Avatar,
  Divider,
  Stack,
  Popover,
  CopyButton,
  Image,
} from "@mantine/core";
import {
  IconArrowBigDown,
  IconArrowBigUp,
  IconShare3,
  IconLink,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function PostPageBox({ post, isLogged }) {
  const [upvote, setUpvote] = useState(post.userUpvote);
  const [downvote, setDownvote] = useState(post.userDownvote);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleUpvote = () => {
    const auth = cookies.get("auth");
    if (!auth) return;
    const token = cookies.get("CSRF_TOKEN");
    axios.post(
      "http://localhost:3000/posts/upvote",
      {
        postId: post.id,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + auth,
          'X-CSRF-TOKEN': token
        },
      }
    );

    if (downvote) {
      setDownvote(false);
      setDownvotes(downvotes - 1);
    }
    if (upvote) {
      setUpvotes(upvotes - 1);
    } else {
      setUpvotes(upvotes + 1);
    }
    setUpvote(!upvote);
  };

  const handleDownvote = () => {
    const auth = cookies.get("auth");
    if (!auth) return;
    const token = localStorage.getItem("csrf_token");
    axios.post(
      "http://localhost:3000/posts/downvote",
      {
        postId: post.id,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + auth,
          'X-CSRF-TOKEN': token
        },
      },
    );

    if (upvote) {
      setUpvote(false);
      setUpvotes(upvotes - 1);
    }
    if (downvote) {
      setDownvotes(downvotes - 1);
    } else {
      setDownvotes(downvotes + 1);
    }
    setDownvote(!downvote);
  };
  return (
    <>
      <Flex shadow="xs" direction="column" gap={5}>
        <Group>
          <Avatar
            component="a"
            target="_blank"
            src={`http://cdn.sagandev.local/${
              post.avatar ? "/users/" + post.avatar : "Default_avatar_profile.jpg"
            }`}
            alt="it's me"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/user/${post.author}`)}
          />
          <Stack gap={0}>
            <Group gap="xs">
              <Text
                size="md"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/r/${post.community_name}`)}
              >
                r/{post.community_name}
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
              <Text size="xs">{post.timestamp}</Text>
            </Group>
            <Text
              size="xs"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/user/${post.author}`)}
            >
              {post.author}
            </Text>
          </Stack>
        </Group>
        <Text fw={700} size="xl">
          {post.title}
        </Text>
        <Text>{post.content}</Text>
        {post?.imagePath ? (
          <Image
            radius="md"
            src={`http://cdn.sagandev.local/posts/${post.imagePath}`}
          />
        ) : null}
        <Flex
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
          gap={5}
        >
          <Group gap={5} pt="xs">
            <Button
              variant={upvote ? "filled" : "default"}
              value={"upvote"}
              radius="lg"
              size="xs"
              leftSection={
                <IconArrowBigUp style={{ width: rem(16), height: rem(16) }} />
              }
              onClick={(e) => handleUpvote()}
              disabled={!isLogged}
            >
              {upvotes}
            </Button>
            <Button
              variant={downvote ? "filled" : "default"}
              value={"downvote"}
              radius="lg"
              size="xs"
              leftSection={
                <IconArrowBigDown style={{ width: rem(16), height: rem(16) }} />
              }
              onClick={(e) => handleDownvote()}
              disabled={!isLogged}
            >
              {downvotes}
            </Button>
          </Group>
          <Group gap={5} pt="xs">
            <Popover
              position="bottom"
              clickOutsideEvents={["mouseup", "touchend"]}
            >
              <Popover.Target>
                <Button
                  variant="default"
                  radius="lg"
                  size="xs"
                  leftSection={
                    <IconShare3 style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  Share
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <CopyButton
                  value={`http://192.168.0.15:5172/r/${post.community_name}/${post.id}`}
                >
                  {({ copied, copy }) => (
                    <Button
                      variant="transparent"
                      color="gray"
                      onClick={copy}
                      w="100%"
                      leftSection={<IconLink />}
                    >
                      {copied ? "Copied link" : "Copy link"}
                    </Button>
                  )}
                </CopyButton>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Flex>
      </Flex>
      <Divider my="sm" />
    </>
  );
}
