import {
    Group,
    Text,
    Avatar,
    Stack,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
export default function CommunitySmallCard({ data }) {
    const navigate = useNavigate();
    return (
        <>
            <Group onClick={() => navigate("r/"+data.name)}>
                <Avatar
                    component="a"
                    target="_blank"
                    alt="it's me"
                    style={{cursor: "pointer"}}
                    src={"http://cdn.sagandev.local/communities/" + data.icon}
                />
                <Stack gap={0}>
                    <Text>r/{data.name}</Text>
                    <Text size="xs" c="dimmed">{data.members} members</Text>
                </Stack>
            </Group>
        </>
    )
}