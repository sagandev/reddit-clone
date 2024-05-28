import axios from "axios";
import { useEffect, useState } from "react";
import {
  AppShell,
  Modal,
  Text,
  Flex,
  Container,
  Button
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import Navbar from "../../components/Navbar";
import { Cookies } from "react-cookie";
import { useDropzone } from "react-dropzone";
import {
  IconX,
  IconChecks
} from "@tabler/icons-react";
import { notifications } from '@mantine/notifications';
import config from "../config";
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
  useEffect(() => {
    const auth = cookies.get("auth");
    if (!auth) {
      navigate("/");
    }else {
      setIsLogged(true);
      let userS = JSON.parse(localStorage.getItem("user"));
      console.log(userS);
      if (userS) setUserLocal(userS);

      axios.get(`${config.apiServer}/users/${userS.user.username}`).then((res) => {
        setUser(res.data.data);
        setUsername(res.data.data.username)
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
  const handleSubmit = () => {
    if (!acceptedFiles[0]) {
        return
    }
    const form = new FormData();

    if (acceptedFiles[0]) {
        if (acceptedFiles[0].type != 'image/jpeg' && acceptedFiles[0].type != 'image/png') {
            return notifications.show({
                title: "Invalid file type",
                message: "The file must be JPEG or PNG type",
                color: 'red',
                withBorder: true,
                withCloseButton: false,
                radius: "lg",
                icon: <IconX />
            })
        }

        if (acceptedFiles[0].size > (4*1024*1024)) {
            return notifications.show({
                title: "Invalid file size",
                message: "Selected file is too big. Max size is 4MB",
                color: 'red',
                withBorder: true,
                withCloseButton: false,
                radius: "lg",
                icon: <IconX />
            })
        }
        form.append('file', acceptedFiles[0]);
    }
    const auth = cookies.get('auth');
    if (!auth) return;
    const token = cookies.get("CSRF_TOKEN");
    axios.post(`${config.apiServer}/users/settings/avatar`, form, {withCredentials: true, headers: {
        'Authorization': "Bearer " + auth,
        'X-CSRF-TOKEN': token
    }}).then((res) => {
        console.log(res)
        notifications.show({
          title: "Your avatar has been updated",
          color: 'green',
          withBorder: true,
          withCloseButton: false,
          radius: "lg",
          icon: <IconChecks />
      })
    })
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
          />
        </AppShell.Header>
        <AppShell.Main>
          <Container size="lg" px={0}>
            <Flex direction="column" gap={10}>
              <Flex direction="column">
                <Text>Avatar</Text>
                <section className="container-dropzone">
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                    <em>(Only JPEG and PNG images will be accepted)</em>
                  </div>
                  <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                  </aside>
                </section>
              </Flex>
              <Button justify="end" onClick={() => handleSubmit()}>
                Confirm
              </Button>
            </Flex>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
