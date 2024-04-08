import {
    Group,
    Text,
    Avatar,
    Stack,
    Paper
} from "@mantine/core";
export default function CommunitySmallCard({ data }) {
    return (
        <>
            <Group>
                <Avatar
                    component="a"
                    href="https://github.com/rtivital"
                    target="_blank"
                    src="avatar.png"
                    alt="it's me"
                />
                <Stack gap={0}>
                    <Text>r/{data.name}</Text>
                    <Text size="xs" c="dimmed">{data.members} members</Text>
                </Stack>
            </Group>
        </>
    )
}