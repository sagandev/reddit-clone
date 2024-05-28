import {
  Button,
  Group,
  PasswordInput,
  Flex,
  Text,
} from "@mantine/core";
import {useSearchParams, useNavigate} from 'react-router-dom';
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconX, IconChecks } from "@tabler/icons-react";
import { Cookies } from "react-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import config from  "../../config";
export default function SetPasswordPage() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  useEffect(() => {
    if (!searchParams || !searchParams.get("email") || !searchParams.get("code")) {
        navigate("/");
        return;
    }

    setEmail(searchParams.get("email"));
    setKey(searchParams.get("code"));
  }, [])
  const form = useForm({
    initialValues: {
      password: "",
      confPassowrd: "",
    },

    validate: {
      confPassword: (value, values) =>
        value != values.password ? "Password do not match" : null,
      password: (value) =>
        value.length < 8 ? "Password must contain minimum 8 characters" : null,
    },
  });

  const handleSubmit = (values) => {
    const token = cookies.get("CSRF_TOKEN");
    if (!token || !values) return;

    axios
      .post(
        `${config.apiServer}/users/set-password`,
        {
          email: email,
          password: values.password,
          key: key
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": token,
          },
        }
      )
      .then((res) => {
        notifications.show({
          title: "New password has been set",
          color: "green",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconChecks />,
        });
      })
      .catch((res) => {
        notifications.show({
          title: "Setting new password failed",
          color: "red",
          icon: <IconX />,
        });
      });
  };
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
          style={{ borderRadius: "20px" }}
          align="center"
          direction="column"
          justify="space-around"
        >
          <Text fw={500} size="xl">
            SET NEW PASSWORD
          </Text>
          <form
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <PasswordInput
              mt="md"
              label="Password"
              withAsterisk
              placeholder="New password"
              radius="lg"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              mt="md"
              label="Confirm password"
              withAsterisk
              placeholder="Confirm new password"
              radius="lg"
              {...form.getInputProps("confPassword")}
            />
            <Group justify="end" mt="md" align="end">
              <Button type="submit" radius="lg">
                Set new password
              </Button>
            </Group>
          </form>
        </Flex>
      </Flex>
    </>
  );
}
