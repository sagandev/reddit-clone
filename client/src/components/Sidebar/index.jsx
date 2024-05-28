import { useEffect, useState } from "react";
import axios from "axios";
import {
  AppShell,
  Accordion,
  Avatar,
  Flex,
  Modal,
  Button,
  Textarea,
  Group,
  Text,
  Switch,
  rem,
  TextInput,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDropzone } from "react-dropzone";
import { IconRating18Plus, IconX, IconChecks } from "@tabler/icons-react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {notifications} from "@mantine/notifications";
import config from "../config";
export default function Sidebar({ user, token }) {
  const [userCommunities, setUserCommunities] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${config.apiServer}/users/${user.user.username}/communities`)
      .then((res) => {
        setUserCommunities(res.data.data);
        console.log(res.data.data);
      });
    userCommunities.map((val) => console.log(val.name));
  }, []);

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

  const iconStyle = { width: rem(12), height: rem(12) };
  const handleSumbit = (values) => {
    if (!values) return;
    const token = cookies.get("auth");
    if (!token) return;
    const form = new FormData();
    form.append("name", values.name);
    form.append("description", values.description);
    form.append("nsfw", values.nsfw);

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
          radius: "md",
          icon: <IconX />,
        });
      }

      if (acceptedFiles[0].size > 20971520) {
        return notifications.show({
          title: "Invalid file size",
          message: "Selected file is too big. Max size size 20MB",
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconX />,
        });
      }
      form.append("file", acceptedFiles[0]);
    }
    const csrf = cookies.get("CSRF_TOKEN");
    axios
      .post(`${config.apiServer}/communities`, form, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
          "X-CSRF-TOKEN": csrf,
        },
      })
      .then((res) => {
        notifications.show({
          title: "Community created successfully",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconChecks />,
        });
        setOpenModal(false);
      }).catch(e => {
        notifications.show({
          title: "Creating community failed",
          color: "red",
          icon: <IconX />,
        });
      });
  };
  return (
    <AppShell.Navbar p="md">
      <Modal
        opened={openModal}
        onClose={() => setOpenModal(!openModal)}
        title="Create new community"
        radius="lg"
      >
        <form onSubmit={form.onSubmit((values) => handleSumbit(values))}>
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
          <Flex direction="row" align="center" justify="space-between" my={10}>
            <IconRating18Plus style={{ width: rem(34), height: rem(34) }} />
            <Flex direction="column" justify="start">
              <Text>Mature (18+)</Text>
              <Text size="sm" c="dimmed">
                Users must be over 18 to view and contribute
              </Text>
            </Flex>
            <Switch size="lg" {...form.getInputProps("nsfw")}></Switch>
          </Flex>
          <Box my={10}>
            <Text size="sm" fw={500}>
              Community icon
            </Text>
            <section className="container-dropzone">
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <em>(Only JPEG and PNG images will be accepted)</em>
              </div>
              <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
              </aside>
            </section>
          </Box>
          <Group justify="end">
            <Button radius="lg" type="submit">
              Create
            </Button>
          </Group>
        </form>
      </Modal>
      <Accordion multiple defaultValue={["item-1"]}>
        <Accordion.Item value="item-1">
          <Accordion.Control>Communities</Accordion.Control>
          <Accordion.Panel>
            <Button
              onClick={() => setOpenModal(!openModal)}
              variant="transparent"
              p={0}
            >
              Create community
            </Button>

            {userCommunities.map((val, i) => {
              return (
                <Flex
                  gap={10}
                  align="center"
                  style={{ cursor: "pointer" }}
                  my={10}
                  onClick={() => navigate(`/r/${val.name}`)}
                >
                  <Avatar
                    component="a"
                    target="_blank"
                    alt="it's me"
                    style={{ cursor: "pointer" }}
                    src={`${config.cdn}/communities/` + val.icon}
                  />{" "}
                  r/{val.name}
                </Flex>
              );
            })}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </AppShell.Navbar>
  );
}
