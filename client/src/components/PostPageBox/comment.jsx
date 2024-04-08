import {
    Group,
    Text,
    Flex,
    Avatar,
    Divider, Stack, Menu, Button, rem
} from "@mantine/core";
import {
    IconTrash,
    IconDotsVertical,
} from '@tabler/icons-react';
export default function Comment({ comment, user }) {
    return (
        <>
            <Flex shadow="xs" direction="column" gap={5} mt={5}>
                <Flex direction="row" align="center" gap="xs" justify="space-between">
                    <Group>
                        <Avatar
                            component="a"
                            href="https://github.com/rtivital"
                            target="_blank"
                            src="avatar.png"
                            alt="it's me"
                        />
                        <Stack gap={0}>
                            <Flex direction="row" align="center" justify="space-around" gap="xs">
                                <Text size="md">{comment.author_name}</Text>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-point-filled" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" stroke-width="0" fill="currentColor" />
                                </svg>
                                <Text size="xs">{comment.timestamp}</Text></Flex>
                        </Stack>
                    </Group>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Button variant="transparent" radius="full" size="xs" ><IconDotsVertical /></Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            {}
                            <Menu.Item
                                color="red"
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
                <Text>
                    {comment.content}
                </Text>
            </Flex>
            <Divider my="sm" />
        </>
    );
}