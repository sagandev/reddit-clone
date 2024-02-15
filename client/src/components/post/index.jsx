import {
    Group,
    Button,
    rem,
    Text, 
    Flex, 
    Avatar, 
    Chip,
    Divider
  } from "@mantine/core";
  import { IconArrowBigUpFilled, IconArrowBigDownFilled, IconMessage2, IconShare3 } from "@tabler/icons-react";
export default function PostBox({post}) {
    return (
        <>
            <Flex shadow="xs" direction="column" gap={5}>
                <Group>
                    <Avatar
                    component="a"
                    href="https://github.com/rtivital"
                    target="_blank"
                    src="avatar.png"
                    alt="it's me"
                    />
                    <Group gap="xs">
                    <Text>r/Community</Text>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-point-filled" width="12" height="12" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" stroke-width="0" fill="currentColor" />
                    </svg>
                    <Text size="xs">5min. ago</Text>
                    </Group>
                </Group>
                <Text fw={700} size="xl">
                    Welcome
                </Text>
                <Text>
                Sea labore illum iriure augue labore et. Sanctus dolor dolore dignissim lorem luptatum et diam option eirmod takimata. Ex dolore ut accusam vero dolores ipsum. Ipsum amet takimata lorem sadipscing diam blandit takimata lobortis dolor takimata sadipscing at lorem duis.
                </Text>
                <Flex justify="flex-start" align="flex-start" direction="row" wrap="wrap" gap={5}>
                    <Chip.Group>
                    <Group gap={5} pt="xs">
                        <Chip value="1" icon={<IconArrowBigUpFilled style={{ width: rem(16), height: rem(16) }}/>}>Up vote</Chip>
                        <Chip value="2" icon={<IconArrowBigDownFilled style={{ width: rem(16), height: rem(16) }}/>}>Down vote</Chip>
                    </Group>
                    </Chip.Group>
                    <Group gap={5} pt="xs">
                    <Button variant="default" radius="lg" size="xs" leftSection={<IconMessage2 style={{ width: rem(16), height: rem(16) }}/>}>120</Button>
                    <Button variant="default" radius="lg" size="xs" leftSection={<IconShare3 style={{ width: rem(16), height: rem(16) }}/>}>Share</Button>
                    </Group>
                </Flex>
            </Flex>
            <Divider my="sm"/>
        </>
    );
}