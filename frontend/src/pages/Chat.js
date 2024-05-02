import { useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebase/auth";
import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import MessagesPane from '../components/MessagesPane';
import { getChat, getProfile } from '../api';

const messagesUser = {
  name: 'Mind Match',
  username: '@mindmatch',
  // avatar: '/static/images/avatar/2.jpg',
  online: true,
};

const Chat = () => {
  let { chatId } = useParams();

  const [p, setP] = React.useState({
    autoListen: false,
  });

  const [chat, setChat] = React.useState({
    id: chatId,
    sender: messagesUser,
    messages: [],
    isFinished: false,
  });

  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    getProfile(user).then(({ profile }) => {
      if (!profile?.learningStyle) {
        navigate("/kyc");
      }
      if (profile?.learningStyle?.includes('listening')) {
        setP({
          autoListen: true,
        });
      }

    });

  }, [user, loading]);

  useEffect(() => {
    if (user && chatId) {
      getChat(user, chatId).then(({ messages, isFinished, quiz }) => {
        messages.forEach(msg => {
          if (msg.sender === 'AI') {
            msg.sender = messagesUser;
          }
        });
        setChat({
          id: chatId,
          sender: messagesUser,
          messages,
          isFinished: !!isFinished,
          quiz: quiz || [],
        });
      });

    } else {
      setChat({
        id: chatId,
        sender: messagesUser,
        messages: [],
        isFinished: false,
        quiz: []
      });
    }
  }, [user, chatId]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Sidebar profile={p} setProfile={setP} chatId={chatId} />
        <Header />
        <Box component="main" className="MainContent" sx={{ flex: 1 }}>
          <MessagesPane  chat={chat} profile={p} />
        </Box>
      </Box>

    </CssVarsProvider>
  );
};

export default Chat;
