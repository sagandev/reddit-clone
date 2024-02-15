import { TextInput, Checkbox, Button, Group, Box, PasswordInput, Anchor, Progress, Center } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import $ from 'jquery';
import { useForm } from '@mantine/form';
import { useToggle, useInputState } from '@mantine/hooks';
function PasswordRequirement({ meets, label }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}
export default function SignupForm() {
    const form = useForm({
      initialValues: {
        email: '',
        username: '',
        password: '',
        confPassword: '',
        termsOfService: false
      },
  
      validate: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        username: (value) => (/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){6,18}[a-zA-Z0-9]$/.test(value) ? null : 'Invalid username'),
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
          <TextInput
            mt="md"
            withAsterisk
            label="Username"
            placeholder="Your username"
            {...form.getInputProps('username')}
          />
          <PasswordInput
            mt="md"
            label="Password"
            withAsterisk
            placeholder="Your password"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            mt="md"
            label="Confirm password"
            withAsterisk
            placeholder="Your password"
            {...form.getInputProps('confPassword')}
          />
          <Checkbox
              mt="md"
              label="I agree with terms of service"
              {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
          <Group justify="end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    );
  }