import axios from "axios";
import { useEffect, useState } from "react";
import {
  AppShell,
  Modal,
  Text,
  Flex,
  Container,
  Button,
  TextInput,
  Textarea,
  rem,
  Switch,
  Box,
  Group,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import { Cookies } from "react-cookie";
import { useDropzone } from "react-dropzone";
import {
  IconX,
  IconChecks,
  IconRating18Plus
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import config from "../../config";
export default function UserSettings() {
  const params = useParams();
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [userLocal, setUserLocal] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [community, setCommunity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [NSFW, setNSFW] = useState(false);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const form = useForm({
    initialValues: { name: "", description: "", nsfw: false },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      description: (value) =>
        value.length < 2 ? "Description must have at least 2 letters" : null,
    },
  });
  useEffect(() => {
    const auth = cookies.get("auth");
    if (!auth) {
      navigate("/");
    } else {
      setIsLogged(true);
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) setUserLocal(user);

      axios
        .get(`${config.apiServer}/communities/${params.community_name}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.data.community.owner != user.user.id) navigate("/");
          setCommunity(res.data.data);
          form.setFieldValue("name", res.data.data.community.name);
          form.setFieldValue(
            "description",
            res.data.data.community.description
          );
          form.setFieldValue("nsfw", Boolean(res.data.data.community.nsfw));
          setNSFW(Boolean(res.data.data.community.nsfw));
          setLoading(false);
        });
    }
  }, []);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 20000000,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  const handleSubmit = (values) => {
    if (!values.name || !values.description || !values.nsfw) return;

    const auth = cookies.get("auth");
    if (!auth) return;
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post(`${config.apiServer}/communities/edit`, {
        name: values.name,
        description: values.description,
        nsfw: values.nsfw,
        communityId: community.community.id
      }, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + auth,
          "X-CSRF-TOKEN": token,
        },
      })
      .then((res) => {
        console.log(res);
        notifications.show({
          title: "Community edited",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconChecks />,
        });
      })
      .catch((e) => {
        notifications.show({
          title: "Editing community failed",
          message: e.response.data.message,
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconX />,
        });
      });
  };
  const handleSubmitIcon = () => {
    if (!acceptedFiles[0]) {
      return;
    }
    const form = new FormData();

    if (acceptedFiles[0]) {
      if (
        acceptedFiles[0].type != "image/jpeg" &&
        acceptedFiles[0].type != "image/png"
      ) {
        return notifications.show({
          title: "Invalid file type",
          message: "The file must be JPEG or PNG type",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconX />,
        });
      }

      if (acceptedFiles[0].size > 4 * 1024 * 1024) {
        return notifications.show({
          title: "Invalid file size",
          message: "Selected file is too big. Max size is 4MB",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconX />,
        });
      }
      form.append("file", acceptedFiles[0]);
    }
    form.append("communityId", community.community.id);
    form.append("oldFileName", community.community.icon);
    const auth = cookies.get("auth");
    if (!auth) return;
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post(`${config.apiServer}/communities/edit/icon`, form, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + auth,
          "X-CSRF-TOKEN": token,
        },
      })
      .then((res) => {
        console.log(res);
        notifications.show({
          title: "Community icon has been updated",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconChecks />,
        });
      })
      .catch((e) => {
        notifications.show({
          title: "Updating icon failed",
          message: e.response.data.message,
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconX />,
        });
      });
  };
  if (loading) return <Loading />;
  else
    return (
      <>
        <Modal
          opened={openedLogin}
          onClose={() => toggleLogin(!openedLogin)}
          title="Log in"
          centered
          radius="lg"
        >
          <Login toggleLogin={toggleLogin} openedLogin={openedLogin} />
        </Modal>
        <Modal
          opened={openedSignup}
          onClose={() => toggleSignup(!openedSignup)}
          title="Sign up"
          centered
          radius="lg"
        >
          <Signup />
        </Modal>
        <AppShell header={{ height: 60 }} padding="md">
          <AppShell.Header>
            <Navbar
              isLogged={isLogged}
              openedLogin={openedLogin}
              toggleLogin={toggleLogin}
              openedSignup={openedSignup}
              toggleSignup={toggleSignup}
              user={userLocal}
            />
          </AppShell.Header>
          <AppShell.Main>
            <Container size="lg" style={{ width: "70vh", borderRadius: "var(--mantine-radius-lg)" }} bg="dark" p={20}>
              <Flex direction="column" gap={10}>
                <form
                  onSubmit={form.onSubmit((values) => handleSubmit(values))}
                >
                  <Flex direction="column" gap={10}>
                    <TextInput
                      label="Community name"
                      withAsterisk
                      radius="lg"
                      {...form.getInputProps("name")}
                    ></TextInput>
                    <Textarea
                      label="Community description"
                      withAsterisk
                      radius="lg"
                      {...form.getInputProps("description")}
                    ></Textarea>
                  </Flex>
                  <Flex
                    direction="row"
                    align="center"
                    justify="space-between"
                    my={10}
                  >
                    <IconRating18Plus
                      style={{ width: rem(34), height: rem(34) }}
                    />
                    <Flex direction="column" justify="start">
                      <Text>Mature (18+)</Text>
                      <Text size="sm" c="dimmed">
                        Users must be over 18 to view and contribute
                      </Text>
                    </Flex>
                    <Switch
                      size="lg"
                      {...form.getInputProps("nsfw")}
                      checked={NSFW}
                      onChange={() => setNSFW(!NSFW)}
                    ></Switch>
                  </Flex>
                  <Group justify="end">
                    <Button radius="lg" type="submit">
                      Update
                    </Button>
                  </Group>
                </form>
                <Flex direction="column" gap={10}>
                  <Box my={10}>
                    <Text size="sm" fw={500}>
                      Community icon
                    </Text>
                    <section className="container-dropzone">
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>
                          Drag 'n' drop some files here, or click to select
                          files
                        </p>
                        <em>(Only JPEG and PNG images will be accepted)</em>
                      </div>
                      <aside>
                        <h4>Files</h4>
                        <ul>{files}</ul>
                      </aside>
                    </section>
                  </Box>
                  <Group justify="end">
                    <Button radius="lg" type="submit" onClick={() => handleSubmitIcon()}>
                      Update icon
                    </Button>
                  </Group>
                </Flex>
              </Flex>
            </Container>
          </AppShell.Main>
        </AppShell>
      </>
    );
}
