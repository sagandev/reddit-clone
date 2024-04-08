import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  Routes, Route, BrowserRouter
} from "react-router-dom";
import HomePage from "./pages/Home";
import PostPage from "./pages/Post";
import SubmitPage from "./pages/Submit";
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { CookiesProvider } from 'react-cookie';
export default function App() {
  return (
    <MantineProvider defaultColorScheme='dark'>
      <Notifications />
      <CookiesProvider defaultSetOptions />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/r/:community_name/:post_id" element={<PostPage/>}/>
          <Route path="/submit" element={<SubmitPage/>}/>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
