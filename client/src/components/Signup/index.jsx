import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  PasswordInput
} from "@mantine/core";
import React from 'react';
import {useState} from 'react';
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import axios from "axios";
import {Cookies} from 'react-cookie';
import { notifications } from "@mantine/notifications";
export default function Signup() {
  const cookies = new Cookies();
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      username: "",
      password: "",
      confPassword: "",
      termsOfService: false
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) =>
        /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/.test(value)
          ? null
          : "Invalid username",
      confPassword: (value, values) =>
        value != values.password ? "Password do not match" : null,
      password: (value) =>
        value.length < 8 ? "Password must contain minimum 8 characters" : null,
      termsOfService: (value) => (value ? null:"Required")
    },
  });
  const handleSubmit = (values) => {
    if(!value) return;
    const token = cookies.get("CSRF_TOKEN");
    axios
      .post("http://localhost:3000/users", {
        email: values.email,
        username: values.username,
        password: values.password,
      },{withCredentials: true, headers: {
        'X-CSRF-TOKEN': token
      }})
      .then((res) => {
        notifications.show({
          title: "User registered successfully",
          message: "Please check your email and confirm registration",
          color: "orange",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconCheck />,
        });
      }).catch((e) => {
        notifications.show({
          title: "User registration failed",
          message: e.response.data.message,
          color: "red",
          withBorder: true,
          withCloseButton: false,
          radius: "md",
          icon: <IconX />,
        });
      });
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          radius="lg"
          {...form.getInputProps("email")}
        />
        <TextInput
          mt="md"
          withAsterisk
          label="Username"
          placeholder="Your username"
          radius="lg"
          {...form.getInputProps("username")}
        />
        <PasswordInput
          mt="md"
          label="Password"
          withAsterisk
          placeholder="Your password"
          radius="lg"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          mt="md"
          label="Confirm password"
          withAsterisk
          placeholder="Your password"
          radius="lg"
          {...form.getInputProps("confPassword")}
        />
        <Checkbox
          mt="md"
          label="I agree with terms of service"
          {...form.getInputProps("termsOfService", { type: "checkbox" })}
          mb={10}
        />
        <Group justify="end" mt="md">
          <Button type="submit" radius="lg">
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}
