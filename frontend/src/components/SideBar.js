import * as React from 'react';
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Switch from '@mui/joy/Switch';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import AddIcon from '@mui/icons-material/Add';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { auth, logout } from "../firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";



import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar, timestampToNiceText } from '../utils';
import { getChatList } from '../api';

function Toggler(props) {
  const { defaultExpanded = false, renderToggle, children } = props;
  const [open, setOpen] = React.useState(defaultExpanded);


  const [user, loading, error] = useAuthState(auth);


  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar(props) {
  const { chatId, noChats = false, profile, setProfile } = props;
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [chats, setChats] = React.useState([]);
  const [autoListen, setAutoListen] = React.useState(profile?.autoListen || false);

  useEffect(() => {
    if (user && !noChats) {
      getChatList(user).then(({ chats: chatList }) => {
        chatList.sort((a, b) => b.created - a.created);
        setChats(chatList)
      });
    }

  }, [user, chatId]);


  useEffect(() => {
    setAutoListen(profile?.autoListen || false);
  }, [profile]);


  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton variant="soft" color="primary" size="sm">
          <PsychologyIcon />
        </IconButton>
        <Typography level="title-lg">Mind Match</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>
      {/* <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" /> */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'left' }}>
        <Switch checked={autoListen} onChange={(e) => {
          setAutoListen(e.target.checked);
          setProfile(p => {
            p.autoListen = e.target.checked;
            return p;
          })
        }} />
        <Typography level="title-sm">Auto Listen</Typography>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          {!noChats && <ListItem>
            <ListItemButton onClick={() => navigate(`/chat`)}>
              <AddIcon />
              <ListItemContent>
                <Typography level="title-sm">New Chat</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>}
          <br />

          {chats.map(
            ({ id, created, name = "" }) => {
              return <ListItem key={id}>
                <ListItemButton selected={id === chatId} onClick={() => {
                  if (id !== chatId) {
                    navigate(`/chat/${id}`);
                  }
                }}>
                  <QuestionAnswerRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">{timestampToNiceText(created)} {name}</Typography>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            }
          )}

        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          variant="outlined"
          size="sm"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {/* <Typography level="title-sm">Name</Typography> */}
          <Typography level="body-xs" sx={{ overflow: 'hidden' }}>{user?.email || ""}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={logout}>
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet >
  );
}
