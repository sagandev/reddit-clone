import {
    Group,
    Button,
    rem,
    Text,
    Flex,
    Avatar,
    Divider, Popover, Image, Badge, Box
} from "@mantine/core";
import { useClipboard } from '@mantine/hooks';
import { IconArrowBigUpFilled, IconArrowBigDownFilled, IconMessage2, IconShare3, IconLink } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
export default function PostBox({ post }) {

    const navigate = useNavigate();
    const clipboard = useClipboard({ timeout: 500 });
    return (
        <>
            <Flex shadow="xs" direction="row" justify="space-between">
                <Flex direction="column" gap={5} w="100%">
                    <Flex direction="column" gap={5} style={{ cursor: "pointer" }} onClick={() => navigate(`/r/${post.community_name}/${post.id}`)}>
                        <Group>
                            <Avatar
                                component="a"
                                href="https://github.com/rtivital"
                                target="_blank"
                                src="avatar.png"
                                alt="it's me"
                            />
                            <Group gap="xs">
                                <Text>r/{post.community_name}</Text>
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-point-filled" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" stroke-width="0" fill="currentColor" />
                                </svg>
                                <Text size="xs">{post.timestamp}</Text>
                                {post.nsfw ? <Badge color="red">
                                    NSFW
                                </Badge> : null}
                            </Group>
                        </Group>
                        <Text fw={700} size="xl">
                            {post.title}
                        </Text>
                        <Text>
                            {post.content}
                        </Text>
                    </Flex>
                    <Flex justify="flex-start" align="flex-end" direction="row" wrap="wrap" gap={5} h="100%">
                        <Group gap={5} pt="xs">
                            <Button variant="default" radius="md" size="xs" leftSection={<IconArrowBigUpFilled style={{ width: rem(16), height: rem(16) }} />}>{post.upvotes}</Button>
                            <Button variant="default" radius="md" size="xs" leftSection={<IconArrowBigDownFilled style={{ width: rem(16), height: rem(16) }} />}>{post.downvotes}</Button>
                        </Group>
                        <Group gap={5} pt="xs">
                            <Button variant="default" radius="md" size="xs" leftSection={<IconMessage2 style={{ width: rem(16), height: rem(16) }} />} onClick={() => navigate(`/r/${post.community_name}/${post.id}`)}>{post.comments}</Button>
                            <Popover position="bottom" clickOutsideEvents={['mouseup', 'touchend']}>
                                <Popover.Target>
                                    <Button variant="default" radius="md" size="xs" leftSection={<IconShare3 style={{ width: rem(16), height: rem(16) }} />}>Share</Button>
                                </Popover.Target>
                                <Popover.Dropdown>
                                    <Button variant='transparent' color='gray' onClick={() => clipboard.copy(`http://192.168.0.15:5173/r/${post.community_name}/${post.id}`)} w="100%" leftSection={<IconLink />}>
                                        Copy
                                    </Button>
                                </Popover.Dropdown>
                            </Popover>
                        </Group>
                    </Flex>
                </Flex>
                {post.imagePath ? <Image
                    radius="md"
                    src={`http://cdn.sagandev.local/${post.imagePath}`}
                    w={200}
                    style={{ filter: post.nsfw ? 'blur(7px)' : null }}
                /> : null}
            </Flex>
            <Divider my="sm" />
        </>
    );
}