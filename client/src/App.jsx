import { useState } from 'react'
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);
export default function App() {
  return (
    <MantineProvider defaultColorScheme='light'>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
