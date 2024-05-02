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
import { setUserProfile, hasUserProfile } from '../api';
import Card from '@mui/joy/Card';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Checkbox from '@mui/joy/Checkbox';
import Typography from '@mui/joy/Typography';
import { Interests, IconGetter, InterestKeyToName } from '../data/interests';

const quiz = require('../data/learnStyleQuiz.json');

const Chat = () => {
  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
  }, [user, loading]);

  const [profile, setProfile] = useState({});
  const [pageState, setPageState] = useState(0);
  const [loadingButton, setLoadingButton] = useState(false);


  const [quizAnswers, setQuizAnswers] = useState({});
  const [allQuizQuestionsAnswered, setAllQuizQuestionsAnswered] = useState(false);

  const setLearningStyle = (s) => {
    setProfile({ "learningStyles": [s] });
    setPageState(2);
    window.scrollTo(0, 0)
  }

  const setLearningStyleQuiz = () => {
    const c = {};
    Object.values(quizAnswers).forEach(v => {
      c[v] = (c[v] || 0) + 1;
    })
    const m = Math.max(...Object.values(c));
    Object.values(quizAnswers).forEach(v => {
      if (c[v] === m) {
        setLearningStyle(v);
      }
    })
  }

  const setInterest = (interest, key, value) => {
    setProfile(p => {
      let l = p[interest] || [];
      if (value) {
        l.push(key);
      } else {
        l = l.filter(e => e !== key);
      }
      p[interest] = l;
      return p;
    });
  }

  const saveProfile = () => {
    setLoadingButton(true);
    setUserProfile(user, profile).then(() => {
      navigate("/chat");
    })
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Sidebar noChats={true} />
        <Header />
        <Box component="main" className="MainContent" sx={{ flex: 1 }}>
          <Box
            sx={(theme) => ({
              width: { xs: '100%' },
              transition: 'width var(--Transition-duration)',
              transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              backdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(255 255 255 / 0.2)',
              [theme.getColorSchemeSelector('dark')]: {
                backgroundColor: 'rgba(19 19 24 / 0.4)',
              },
            })}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100dvh',
                width: '100%',
                px: 2,
              }}
            >
              <Box
                component="main"
                sx={{
                  my: 'auto',
                  py: 2,
                  pb: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  // width: 400,
                  maxWidth: 600,
                  mx: 'auto',
                  borderRadius: 'sm',
                  '& form': {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  },
                  [`& .MuiFormLabel-asterisk`]: {
                    visibility: 'hidden',
                  },
                }}
              >
                {pageState === 0 && <>
                  <Typography component="h1" level="h1">
                    Mind Match
                  </Typography>
                  <Box sx={{ fontStyle: 'italic' }}>
                    <Typography component="h4" level="h4">
                      Experience education that fits your unique learning style.
                    </Typography>
                  </Box>

                  <Typography component="h2" level="h3">
                    HOW DO YOU BEST UNDERSTAND INFORMATION?
                  </Typography>

                  <ButtonGroup color="primary" spacing="0.5rem" aria-label="spacing button group" variant="solid" buttonFlex={1}>
                    <Button startDecorator={<VisibilityIcon />} onClick={() => setLearningStyle('visual')}>Visual</Button>
                    <Button startDecorator={<VolumeUpIcon />} onClick={() => setLearningStyle('listening')}>Audio</Button>
                    <Button startDecorator={<MenuBookIcon />} onClick={() => setLearningStyle('reading')}>Reading</Button>
                  </ButtonGroup>
                  <Button startDecorator={<QuestionMarkIcon />} onClick={() => setPageState(1)}>Do not know</Button>
                </>}

                {pageState === 1 &&
                  <>
                    {quiz.map(({ question, answers }, ind) => <Card>

                      <Typography level="body-sm">
                        {question}
                      </Typography>
                      <RadioGroup
                        defaultValue="outlined"
                        onChange={(e) => setQuizAnswers(a => {
                          a[ind] = e.target.value;
                          let allAns = true;
                          for (let i = 0; i < quiz.length; i++) {
                            if (!a[i]) allAns = false;
                          }
                          if (allAns) {
                            setAllQuizQuestionsAnswered(true);
                          }
                          return a;
                        })}
                      >
                        {answers.map(({ text, learningStyle }) =>
                          <Radio
                            orientation="vertical"
                            size="md"
                            variant="solid"
                            value={learningStyle}
                            label={text} />)}
                      </RadioGroup>
                    </Card>)}
                    <Button disabled={!allQuizQuestionsAnswered} onClick={setLearningStyleQuiz}> Continue</Button>
                  </>
                }

                {pageState === 2 &&
                  <>
                    {Object.keys(Interests).map(k =>
                      <Card>

                        <Typography level="body-sm">
                          {InterestKeyToName[k]}
                        </Typography>
                        <List>
                          {Interests[k].map(({ name, icon }) =>
                            <ListItem key={name}>
                              <Checkbox label={name} onChange={(e) => setInterest(k, name, e.target.checked)} variant="solid" />
                              <Typography textColor="inherit" sx={{ ml: 'auto' }}>
                                {icon && IconGetter[icon]()}
                              </Typography>
                            </ListItem>

                          )}
                        </List>
                      </Card>
                    )}
                    <Button loading={loadingButton}  onClick={saveProfile}> Continue</Button>
                  </>
                }
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider >
  );
};

export default Chat;
