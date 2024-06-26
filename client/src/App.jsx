import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {
  Routes, Route, BrowserRouter
} from "react-router-dom";
import HomePage from "./pages/Home";
import PostPage from "./pages/Post";
import CommunityPage from "./pages/Community";
import UserPage from "./pages/User";
import UserSettings from "./pages/Settings";
import SubmitPage from "./pages/Submit";
import NotFound from "./pages/NotFound";
import RecoveryPage from "./pages/RecoveryPage";
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';
import { CookiesProvider } from 'react-cookie';
import { useEffect } from 'react';
import SetPasswordPage from './pages/SetNewPassword';
import ActivateAccountPage from './pages/ActivateAccount';
import CommunitySettingsPage from './pages/CommunitySettings';
import axios from 'axios';
export default function App() {
  useEffect(() => {
    axios.defaults.withCredentials = true;
  })
  return (
    <MantineProvider defaultColorScheme='dark'>
      <Notifications />
      <CookiesProvider defaultSetOptions />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/r/:community_name/:post_id" element={<PostPage/>}/>
          <Route path="/r/:community_name" element={<CommunityPage/>}/>
          <Route path="/user/:username" element={<UserPage/>}/>
          <Route path="/settings" element={<UserSettings/>}/>
          <Route path="/submit" element={<SubmitPage/>}/>
          <Route path="/recovery" element={<RecoveryPage/>}/>
          <Route path="/set-password" element={<SetPasswordPage/>}/>
          <Route path="/activate-account" element={<ActivateAccountPage/>}/>
          <Route path="/r/:community_name/edit" element={<CommunitySettingsPage/>}/>
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
