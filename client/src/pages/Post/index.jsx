import $ from 'jquery';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    AppShell,
    Modal,
    rem, Text, Flex, Grid, Container, SegmentedControl, Center, Loader, Input, Button
  } from "@mantine/core";
  import Login from "../../components/Login";
  import Signup from "../../components/Signup";
  import PostPageBox from "../../components/PostPageBox";
  import Navbar from "../../components/navbar";
export default function PostPage() {
    const params = useParams();
    const [isLogged, setIsLogged] = useState(false);
    const [openedLogin, toggleLogin] = useState(false);
    const [openedSignup, toggleSignup] = useState(false);
    const [post, setPost] = useState([]);
    const [community, setCommunity] = useState([]);
    useEffect(() => {
        $.ajax({
            method: "GET",
            url: `http://localhost:3000/posts/${params.post_id}`
        }).done((res) => {
            console.log(res)
            setPost(res.data);
            $.ajax({
                method: "GET",
                url: `http://localhost:3000/communities/${res.data.post.community_id}`
            }).done((resCom) => {
                console.log(resCom)
                setCommunity(resCom.data);
            })
        })
        const auth = localStorage.getItem("auth");
        if (auth) {
            setIsLogged(true);
        }
    }, []);

    return (<>
        <Modal opened={openedLogin} onClose={() => toggleSignup(!openedLogin)} title="Log in" centered>
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
                <Navbar isLogged={isLogged} openedLogin={openedLogin} toggleLogin={toggleLogin} openedSignup={openedSignup} toggleSignup={toggleSignup}/>
            </AppShell.Header>
            <AppShell.Main>
                <Container size="lg" px={0}>
                    <Grid>
                        <Grid.Col span="auto">
                            {
                                post.post ? <PostPageBox post={post.post}/> : <Loader color="blue" type="dots" />
                            }
                            <Flex shadow="xs" direction="column" gap={5}>
                                <Input radius="xl" placeholder="Add comment" />
                            </Flex>
                        </Grid.Col>
                        <Grid.Col span={3} visibleFrom="md">
                            {post.post ? 
                            <Flex ml="sm" direction="column" gap="sm" p="lg" style={{ backgroundColor: "var(--mantine-color-dark-6)", borderRadius: "var(--mantine-radius-md)" }}>
                                <Flex direction="row" justify="space-between" align="center">
                                    <Text fw={500} size="lg">r/{post.post.community_name}</Text>
                                    <Button variant="outline" radius="xl" size="xs">Join</Button>
                                </Flex>
                                <Text>
                                </Text>
                            </Flex> : <Loader color="blue" type="dots" />}
                        </Grid.Col>
                    </Grid>
                </Container>
            </AppShell.Main>
        </AppShell>
    </>);
}