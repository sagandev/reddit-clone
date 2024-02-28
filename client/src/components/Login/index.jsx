import { TextInput, Button, Group, Box, PasswordInput, Anchor} from '@mantine/core';
import { useForm } from '@mantine/form';
import $ from 'jquery';
import { notifications } from '@mantine/notifications';
import { IconX, IconChecks } from '@tabler/icons-react';
export default function LoginForm({toggleLogin, openedLogin}) {
    const form = useForm({
      initialValues: {
        email: '',
        password: ''
      },
  
      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        password: (value) => value.length > 3 ? null : 'This field is required'
      },
    });
  
    function handleSubmit(values) {
      console.log(values)
      if (localStorage.getItem('auth')){
        notifications.show({
          title: "Login failed",
          message: "You are already logged in",
          color: 'red',
          icon: <IconX />
        })
        toggleLogin(!openedLogin);
        return;
      }
      $.ajax({
        method: "POST",
        url: "http://localhost:3000/auth",
        data: JSON.stringify(values)
      }).done((res) => {
        localStorage.setItem("auth", res.data.token);
        notifications.show({
          title: "Login successfully",
          message: "Welcome back!",
          color: 'green',
          icon: <IconChecks />
        })
        toggleLogin(!openedLogin);
      }).fail((res) => {
        notifications.show({
          title: "Login failed",
          message: "Invalid email or password",
          color: 'red',
          icon: <IconX />
        })
      })
    }

    return (
      <Box mx="auto">
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mt="md"
            label="Password"
            withAsterisk
            placeholder="Your password"
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="md">
            <Anchor component="button" type="button" c="dimmed" size="xs">
              Forgot your password?
            </Anchor>
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    );
  }