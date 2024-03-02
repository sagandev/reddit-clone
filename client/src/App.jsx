import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  Routes, Route, BrowserRouter
} from "react-router-dom";
import HomePage from "./pages/Home";
import PostPage from "./pages/Post";
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { CookiesProvider } from 'react-cookie';
import ProtectedRoutes from './protectedRoutes';
import AdminPage from './admin';
export default function App() {
  return (
    <MantineProvider defaultColorScheme='dark'>
      <Notifications />
      <CookiesProvider defaultSetOptions />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/r/:community_name/:post_id" element={<PostPage/>}/>
          <Route element={<ProtectedRoutes/>}>
            <Route path="/admin" element={<AdminPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
