import { useState } from 'react'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/Home";
import PostPage from "./pages/Post";
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/r/:community_name/:post_id",
    element: <PostPage />
  }
]);
export default function App() {
  return (
    <MantineProvider defaultColorScheme='dark'>
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
