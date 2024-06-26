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
  Group,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import Navbar from "../../components/Navbar";
import { Cookies } from "react-cookie";
import { useDropzone } from "react-dropzone";
import { IconX, IconChecks, IconCirclePlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import config from "../../config";
export default function UserSettings() {
  const params = useParams();
  const [openedLogin, toggleLogin] = useState(false);
  const [openedSignup, toggleSignup] = useState(false);
  const [user, setUser] = useState([]);
  const [userLocal, setUserLocal] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const form = useForm({
    initialValues: { display_name: "", about: ""},

    // functions will be used to validate values at corresponding key
    // validate: {
    //   name: (value) =>
    //     value.length < 2 ? "Name must have at least 2 letters" : null,
    //   description: (value) =>
    //     value.length < 2 ? "Description must have at least 2 letters" : null,
    // },
  });
  useEffect(() => {
    const auth = cookies.get("auth");
    if (!auth) {
      navigate("/");
    } else {
      setIsLogged(true);
      let userS = JSON.parse(localStorage.getItem("user"));
      if (userS) setUserLocal(userS);

      axios
        .get(`${config.apiServer}/users/${userS.user.username}`, {
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data.data);
          form.setFieldValue("display_name", res.data.data.display_name);
          form.setFieldValue(
            "about",
            res.data.data.about
          );
          setUsername(res.data.data.username);
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
  const handleSubmitAvatar = () => {
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
    const auth = cookies.get("auth");
    if (!auth) return;
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post(`${config.apiServer}/users/settings/avatar`, form, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + auth,
          "X-CSRF-TOKEN": token,
        },
      })
      .then((res) => {
        console.log(res);
        notifications.show({
          title: "Your avatar has been updated",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconChecks />,
        });

        const user = userLocal;
        user.user.avatar = res.data.data;
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((e) => {
        notifications.show({
          title: "Updating avatar failed",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconX />,
        });
      });
  };
  const handleSubmit = (values) => {
    console.log(user)
    if(values.display_name == user.display_name && values.about == user.about) return;
    
    const auth = cookies.get("auth");
    if (!auth) return;
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post(`${config.apiServer}/users/settings/details`, {
        display_name: values.display_name,
        about: values.about,
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
          title: "Profile edited",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconChecks />,
        });
      })
      .catch((e) => {
        notifications.show({
          title: "Editing profile failed",
          message: e.response.data.message,
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconX />,
        });
      });
  }
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
          <Container size="lg" px={0}>
            <Flex
              direction="column"
              gap={10}
              style={{ borderRadius: "var(--mantine-radius-lg)" }}
              bg="dark"
              p={20}
            >
              <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Flex direction="column" gap={10}>
                  <TextInput
                    label="Display name (optional)"
                    radius="lg"
                    {...form.getInputProps("display_name")}
                  ></TextInput>
                  <Textarea
                    label="About (optional)"
                    radius="lg"
                    {...form.getInputProps("about")}
                  ></Textarea>

                  <Group justify="end">
                    <Button radius="lg" type="submit">
                      Update Details
                    </Button>
                  </Group>
                </Flex>
              </form>
              <Flex direction="column" gap={10}>
                <Text>Avatar</Text>
                <Flex direction="row" gap={10} wrap="wrap">
                  <section className="container-dropzone" style={{flex: 1, borderRadius: "var(--mantine-radius-lg)", padding: 5, width: 'fit-content'}}>
                    <div {...getRootProps({ className: "dropzone" })} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                      <input {...getInputProps()} />
                      <IconCirclePlus/>
                      <p>
                        Drag 'n' drop or upload <b>Avatar</b> Image
                      </p>
                    </div>
                    <aside>
                      <ul>{files}</ul>
                    </aside>
                  </section>
                </Flex>
                <Group justify="end">
                  <Button radius="lg" type="submit" onClick={() => handleSubmitAvatar()}>
                    Update Avatar
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
