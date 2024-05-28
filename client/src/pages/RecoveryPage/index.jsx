import {
  TextInput,
  Button,
  Group,
  Box,
  PasswordInput,
  Anchor,
  Flex,
  Text
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX, IconChecks } from "@tabler/icons-react";
import { Cookies } from "react-cookie";
import { useTimeout } from "@mantine/hooks";
import axios from "axios";
export default function RecoveryPage() {
  const cookies = new Cookies();
  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = (values) => {
    const token = cookies.get("CSRF_TOKEN");
    if (!token || !values) return;

    axios.post("http://localhost:3000/auth/password-recovery", {
      email: values.email
    }, {
      withCredentials: true,
      headers: {
        'X-CSRF-TOKEN': token
      }
    }).then((res) => {
      notifications.show({
        title: "Recovery code sent",
        message: "Check your email to complete recovery. Message can be in SPAM folder.",
        color: "orange",
        withBorder: true,
        withCloseButton: false,
        radius: "md",
        icon: <IconChecks />,
      });
    }).catch((res) => {
      notifications.show({
        title: "Sending recovery code failed",
        message: "You already started recovery process. Check your email.",
        color: "red",
        icon: <IconX />,
      });
    })
  }
  return (
    <>
      <Flex
        direction="column"
        justify="center"
        align="center"
        style={{ height: "100vh" }}
      >
        <Flex
          mx="auto"
          bg="dark"
          p={20}
          w="50vh"
          h="25vh"
          style={{ borderRadius: "20px" }}
          align="center"
          direction="column"
          justify="space-around"
        >
          <Text fw={500} size="xl">ACCOUNT RECOVERY</Text>
          <form
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
              radius="lg"
            />
            <Group justify="end" mt="md" align="end">
              <Button type="submit" radius="lg">
                Send recovery code
              </Button>
            </Group>
          </form>
        </Flex>
      </Flex>
    </>
  );
}
