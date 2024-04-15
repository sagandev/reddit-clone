import axios from 'axios';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    AppShell,
    Modal,
    Text, Flex, Grid, Container, Loader, Input, Button, CopyButton, Textarea, Pagination, Center
} from "@mantine/core";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import PostPageBox from "../../components/PostPageBox";
import Navbar from "../../components/navbar";
import Comment from "../../components/PostPageBox/comment";
import { Cookies } from 'react-cookie';
import { useForm } from '@mantine/form';
import { IconSend, IconLink } from '@tabler/icons-react';

const commentsPaginated = (comments) => {
    const dataOnSinglePage = 5;
    const pages = Math.ceil(comments.length / dataOnSinglePage);
    let data = [];
    let rowPoint = 0;

    for (let i = 0; i < pages; i++) {
        let page = [];
        for (let j = rowPoint; j < rowPoint + dataOnSinglePage; j++) {
            if (j > comments.length - 1) break;
            page.push(comments[j]);
        }
        data.push(page)
        rowPoint += dataOnSinglePage;
    }

    return data;
}

export default function PostPage() {
    const params = useParams();
    const [isLogged, setIsLogged] = useState(false);
    const [openedLogin, toggleLogin] = useState(false);
    const [openedSignup, toggleSignup] = useState(false);
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState();
    const [newComments, setNewComments] = useState([]);
    const [community, setCommunity] = useState([]);
    const [user, setUser] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [blockType, setBlockType] = useState(false);
    const cookies = new Cookies();
    useEffect(() => {
        const auth = cookies.get("auth");
        if (auth) {
            setIsLogged(true);
        }
        axios.get(`http://localhost:3000/posts/${params.post_id}`, { headers: auth ? { "Authorization": "Bearer " + auth } : null }).then((res) => {
            setPost(res.data.data);
            const data = commentsPaginated(res.data.data.comments);
            setComments(data);
            axios.get(`http://localhost:3000/communities/${res.data.data.post.community_id}`).then((res) => {
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
                setNewComments([...newComments, {id: res.data.data.id, author_id: res.data.data.author_id, post_id: res.data.data.post_id, content: res.data.data.content, author_name: user.user.username, timestamp: "now"}])
            }
        })
        setBlockType(true);
        setTimeout(() => {
            setBlockType(false);
        }, 3000)
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
                        <Grid.Col span="auto" >
                            {
                                post.post ? <PostPageBox post={post.post} isLogged={isLogged}/> : <Loader color="blue" type="dots" />
                            }
                            <Flex shadow="xs" direction="column" gap={5}>
                                <form onSubmit={form.onSubmit((values) => handleSubmit(values))} style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                                    <Textarea radius="md" placeholder="Add comment" disabled={!isLogged || blockType ? true : false} style={{ flex: 1 }} {...form.getInputProps('content')} />
                                    <Button type="submit" variant='blue' color='gray' radius="md" leftSection={<IconSend />} disabled={!isLogged || blockType ? true : false}>Send</Button>
                                </form>
                                {newComments ? newComments.map((val, i) => <Comment comment={val} key={i} />): null}
                                {comments?.length >= 1 ? comments[activePage - 1].map((val, i) => <Comment comment={val} key={i} />):null}
                            </Flex>
                            <Center>{comments ? <Pagination total={comments.length} size="md" radius="md" withControls={true} value={activePage} onChange={setActivePage}/> : null }</Center>
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