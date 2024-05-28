import { Title, Button, Center, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Center>
      <Stack>
        <Title align="center">404</Title>
        <Button onClick={() => navigate('/')}>Go back to home page</Button>
      </Stack>
    </Center>
  );
}