import {
  Group,
  Button,
  rem,
  Text,
  Flex,
  Avatar,
  Divider,
  Popover,
  Image,
  Badge,
  Box,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
  IconArrowBigUpFilled,
  IconArrowBigDownFilled,
  IconMessage2,
  IconShare3,
  IconLink,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
export default function PostBox({ post }) {
  const navigate = useNavigate();
  const clipboard = useClipboard({ timeout: 500 });
  return (
    <>
      <Flex shadow="xs" direction="row" justify="space-between">
        <Flex direction="column" gap={5} w="100%">
          <Flex
            direction="row"
            gap={5}
            style={{ cursor: "pointer" }}
            justify="space-between"
            wrap="wrap"
          >
            <Flex direction="column" gap={5}>
              <Group>
                <Avatar
                  component="a"
                  target="_blank"
                  alt="it's me"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/r/${post.community_name}`)}
                  src={config.cdn + "/communities/" + post.community_icon}
                />
                <Group
                  gap="xs"
                  onClick={() =>
                    navigate(`/r/${post.community_name}/${post.id}`)
                  }
                >
                  <Text>r/{post.community_name}</Text>
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
                  {post.nsfw ? <Badge color="red">NSFW</Badge> : null}
                </Group>
              </Group>
              <Text
                fw={700}
                size="xl"
                onClick={() => navigate(`/r/${post.community_name}/${post.id}`)}
              >
                {post.title}
              </Text>
              <Text
                onClick={() => navigate(`/r/${post.community_name}/${post.id}`)}
              >
                {post.content}
              </Text>
            </Flex>
            {post.imagePath ? (
              <Image
                radius="md"
                src={`${config.cdn}/posts/${post.imagePath}`}
                w={220}
                style={{ filter: post.nsfw ? "blur(7px)" : null}}
              />
            ) : null}
          </Flex>
          <Flex
            justify="flex-start"
            align="flex-end"
            direction="row"
            wrap="wrap"
            gap={5}
            h="100%"
          >
            <Group gap={5} pt="xs">
              <Button
                variant="default"
                radius="lg"
                size="xs"
                leftSection={
                  <IconArrowBigUpFilled
                    style={{ width: rem(16), height: rem(16) }}
                  />
                }
              >
                {post.upvotes}
              </Button>
              <Button
                variant="default"
                radius="lg"
                size="xs"
                leftSection={
                  <IconArrowBigDownFilled
                    style={{ width: rem(16), height: rem(16) }}
                  />
                }
              >
                {post.downvotes}
              </Button>
            </Group>
            <Group gap={5} pt="xs">
              <Button
                variant="default"
                radius="lg"
                size="xs"
                leftSection={
                  <IconMessage2 style={{ width: rem(16), height: rem(16) }} />
                }
                onClick={() => navigate(`/r/${post.community_name}/${post.id}`)}
              >
                {post.comments}
              </Button>
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
                  <Button
                    variant="transparent"
                    color="gray"
                    onClick={() =>
                      clipboard.copy(
                        `${config.clientAddr}/r/${post.community_name}/${post.id}`
                      )
                    }
                    w="100%"
                    leftSection={<IconLink />}
                  >
                    Copy
                  </Button>
                </Popover.Dropdown>
              </Popover>
            </Group>
          </Flex>
        </Flex>
      </Flex>
      <Divider my="sm" />
    </>
  );
}
