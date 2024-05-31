import {
  AppShell,
  Modal,
  rem,
  Text,
  Flex,
  Grid,
  Container,
  SegmentedControl,
  Center,
  Loader,
  Button,
  Stack,
  CopyButton,
  Avatar
} from "@mantine/core";
import config from '../../config';
import { IconShare3 } from "@tabler/icons-react";
export default function UserCard({ user }) {
  return (
    <>
      <Flex
        direction="column"
        style={{ borderRadius: "var(--mantine-radius-lg)" }}
        bg="dark"
        p={20}
        w={300}
        visibleFrom="md"
        gap={20}
      >
        <Flex direction="column">
          <Flex direction="row" gap={10}>
            <Avatar
              src={`${config.cdn}${
                user.avatar
                  ? "/users/" + user.avatar
                  : "/Default_avatar_profile.jpg"
              }`}
            />
            <Flex direction="column">
              <Text>{user.username}</Text>
              <Text size="sm" c="dimmed">
                {user.display_name}
              </Text>
            </Flex>
          </Flex>
          <Text my={10}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            tristique mauris in sapien gravida pharetra. Sed et ante sit amet
            augue facilisis vehicula ut sed nibh.{" "}
          </Text>
          <CopyButton value="https://mantine.dev">
            {({ copied, copy }) => (
              <Button
                color={copied ? "blue" : "gray"}
                onClick={copy}
                radius="lg"
                rightSection={
                  <IconShare3 style={{ width: rem(16), height: rem(16) }} />
                }
              >
                {copied ? "Copied url" : "Share"}
              </Button>
            )}
          </CopyButton>
        </Flex>
        <Flex direction="row" wrap="wrap" gap={10} justify="space-between">
          <Flex direction="column">
            <Text>1</Text>
            <Text c="dimmed">Posts</Text>
          </Flex>
          <Flex direction="column">
            <Text>1</Text>
            <Text c="dimmed">Comments</Text>
          </Flex>
          <Flex direction="column">
            <Text>1</Text>
            <Text c="dimmed">Cake day</Text>
          </Flex>
        </Flex>
        <Flex direction="row" wrap="wrap" gap={35}>
          <Flex direction="column">
            <Text>1</Text>
            <Text c="dimmed">Karma</Text>
          </Flex>
          <Flex direction="column">
            <Text>1</Text>
            <Text c="dimmed">Followers</Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
