import axios from 'axios';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    AppShell,
    Modal,
    Text, Flex, Grid, Container, Loader, Input, Button, CopyButton, Textarea
} from "@mantine/core";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import PostPageBox from "../../components/PostPageBox";
import Navbar from "../../components/navbar";
import Comment from "../../components/PostPageBox/comment";
import { Cookies } from 'react-cookie';
import { useForm } from '@mantine/form';
import { IconSend, IconLink } from '@tabler/icons-react';
export default function PostPage() {
    const params = useParams();
    const [isLogged, setIsLogged] = useState(false);
    const [openedLogin, toggleLogin] = useState(false);
    const [openedSignup, toggleSignup] = useState(false);
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [community, setCommunity] = useState([]);
    const [user, setUser] = useState([]);
    const cookies = new Cookies();
    useEffect(() => {
        const auth = cookies.get("auth");
        if (auth) {
            setIsLogged(true);
        }
        axios.get(`http://localhost:3000/posts/${params.post_id}`, { headers: auth ? { "Authorization": "Bearer " + auth } : null }).then((res) => {
            console.log(res)
            setPost(res.data.data);
            setComments(res.data.data.comments);
            axios.get(`http://localhost:3000/communities/${res.data.data.post.community_id}`).then((res) => {
                console.log(res)
                setCommunity(res.data.data);
            })
        })

        const user = localStorage.getItem("user");
        if (user) setUser(user);
    }, []);
    const form = useForm({
        initialValues: {
            content: '',
        },

        validate: {
            content: (value) => value.length > 3 ? null : 'Invalid email',
        },
    });
    const handleSubmit = (values) => {
        const auth = cookies.get("auth");
        if (!auth) return;
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user)
        axios.post("http://localhost:3000/comments", {
            content: values.content,
            postId: post.post.id
        },
        {
            headers: {
                "Authorization": "Bearer " + auth
            }
        }).then((res) => {
            if (res.data.status == 200) {
                setComments([...comments, {id: res.data.data.id, author_id: res.data.data.author_id, post_id: res.data.data.post_id, content: res.data.data.content, author_name: user.user.username, timestamp: "now"}])
            }
        })
    }


    return (<>
        <Modal opened={openedLogin} onClose={() => toggleLogin(!openedLogin)} title="Log in" centered>
            <Login toggleLogin={toggleLogin} openedLogin={openedLogin} />
        </Modal>
        <Modal
            opened={openedSignup}
            onClose={() => toggleSignup(!openedSignup)}
            title="Sign up"
            centered
        >
            <Signup />
        </Modal>
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Navbar isLogged={isLogged} openedLogin={openedLogin} toggleLogin={toggleLogin} openedSignup={openedSignup} toggleSignup={toggleSignup} />
            </AppShell.Header>
            <AppShell.Main>
                <Container size="lg" px={0}>
                    <Grid>
                        <Grid.Col span="auto">
                            {
                                post.post ? <PostPageBox post={post.post} isLogged={isLogged}/> : <Loader color="blue" type="dots" />
                            }
                            <Flex shadow="xs" direction="column" gap={5}>
                                <form onSubmit={form.onSubmit((values) => handleSubmit(values))} style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                                    <Textarea radius="md" placeholder="Add comment" disabled={isLogged ? false : true} style={{ flex: 1 }} {...form.getInputProps('content')} />
                                    <Button type="submit" variant='blue' color='gray' radius="md" leftSection={<IconSend />} disabled={isLogged ? false : true}>Send</Button>
                                </form>
                                {comments ? comments.map((val, i) => <Comment comment={val} key={i} />) : <Loader color="blue" type="dots" />}
                            </Flex>
                        </Grid.Col>
                        <Grid.Col span={3} visibleFrom="md">
                            {post.post ?
                                <Flex ml="sm" direction="column" gap="sm" p="lg" style={{ backgroundColor: "var(--mantine-color-dark-6)", borderRadius: "var(--mantine-radius-md)" }}>
                                    <Flex direction="row" justify="space-between" align="center">
                                        <Text fw={500} size="lg">r/{post.post.community_name}</Text>
                                        <Button variant="filled" radius="md" size="xs">Join</Button>
                                    </Flex>
                                    <Text>
                                        {community.community?.description}
                                    </Text>
                                    <Flex direction="row" justify="space-between" align="center">
                                        <Flex direction="column">
                                            <Text size="sm">{community.community?.members_count}</Text>
                                            <Text size="sm" c="dimmed">Members</Text>
                                        </Flex>
                                        <Flex direction="column">
                                            <CopyButton value={`http://192.168.0.15:5172/r/${post.community_name}`}>
                                                {({ copied, copy }) => (
                                                    <Button variant='transparent' color='gray' onClick={copy} w="100%" leftSection={<IconLink />}>
                                                        {copied ? 'Copied link' : 'Copy link'}
                                                    </Button>
                                                )}
                                            </CopyButton>
                                        </Flex>
                                    </Flex>
                                </Flex> : <Loader color="blue" type="dots" />}
                        </Grid.Col>
                    </Grid>
                </Container>
            </AppShell.Main>
        </AppShell>
    </>);
}