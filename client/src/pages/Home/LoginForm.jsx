import { TextInput, Checkbox, Button, Group, Box, PasswordInput, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import $ from 'jquery';
export default function LoginForm() {
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
  
    return (
      <Box mx="auto">
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
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