import {
  TextInput,
  Button,
  Group,
  Box,
  PasswordInput,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX, IconChecks } from "@tabler/icons-react";
import { Cookies } from "react-cookie";
import axios from "axios";
import config from  "../../config";
export default function LoginForm({ toggleLogin, openedLogin }) {
  const cookies = new Cookies();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 3 ? null : "This field is required"),
    },
  });

  function handleSubmit(values) {
    console.log(values);
    if (cookies.get("auth")) {
      notifications.show({
        title: "Login failed",
        message: "You are already logged in",
        color: "red",
        withBorder: true,
        withCloseButton: false,
        radius: "md",
        icon: <IconX />,
      });
      toggleLogin(!openedLogin);
      return;
    }
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post(
        `${config.apiServer}/auth`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": token,
          },
        }
      )
      .then((res) => {
        if (res.data.data.active == 0) {
          notifications.show({
            title: "Your account is inactive",
            message: "Check your email and activate you account.",
            color: "red",
            icon: <IconX />,
          });
        } else {
          // cookies.set("auth", res.data.data.token, {
          //   expires: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
          //   path: "/",
          // });
          localStorage.setItem("user", JSON.stringify(res.data.data));
          notifications.show({
            title: "Login successfully",
            message: "Welcome back! You will be redirected in a few seconds.",
            color: "green",
            withBorder: true,
            withCloseButton: false,
            radius: "md",
            icon: <IconChecks />,
          });
          toggleLogin(!openedLogin);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((res) => {
        notifications.show({
          title: "Login failed",
          message: "Invalid email or password",
          color: "red",
          icon: <IconX />,
        });
      });
  }

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
          radius="lg"
        />
        <PasswordInput
          mt="md"
          label="Password"
          withAsterisk
          placeholder="Your password"
          {...form.getInputProps("password")}
          radius="lg"
        />
        <Group justify="space-between" mt="md">
          <Anchor href={`${config.clientAddr}/recovery/`} c="dimmed" size="xs">
            Forgot your password?
          </Anchor>
          <Button type="submit" radius="lg">
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}
