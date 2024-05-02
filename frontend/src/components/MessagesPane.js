import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { useAuthState } from "react-firebase-hooks/auth";
import { createChat, sendMessage, finishChat, sendQuizAnswers } from '../api';
import { auth } from "../firebase/auth";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Card from '@mui/joy/Card';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function MessagesPane(props) {
  const { chat, profile } = props;
  const [chatMessages, setChatMessages] = React.useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = React.useState('');

  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);

  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [autoPlayId, setAutoPlayId] = React.useState(0);
  const [streaming, setSteaming] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(chat.isFinished);
  const [loadingButton, setLoadingButton] = React.useState(false);
  const [quiz, setQuiz] = React.useState([]);
  const [quizInd, setQuizInd] = React.useState(0);
  const [quizEnded, setQuizEnded] = React.useState(false);



  const addMessageChunk = (msg) => {
    setChatMessages(oms => {
      if (oms.length == 0 || oms[oms.length - 1].sender == 'You') {
        return [
          ...oms,
          {
            id: Date.now(),
            sender: chat.sender,
            content: msg,
            timestamp: Date.now(),
          },
        ]
      } else {
        oms[oms.length - 1].content = msg;
        return [...oms];
      }
    });
  }

  const onEnd = () => {
    setSteaming(false);
  }

  React.useEffect(() => {
    if (!streaming && profile?.autoListen && chatMessages.length > 0)
      if (chatMessages[chatMessages.length - 1].sender == chat.sender)
        setAutoPlayId(chatMessages[chatMessages.length - 1].id);
  }, [streaming, chatMessages]);

  React.useEffect(() => {
    if (!streaming) {
      setChatMessages(chat.messages);
      setQuiz(chat.quiz || []);
      chat?.quiz?.forEach((q, i) => {
        if (q.userAnswer) setQuizInd(i + 1);
        setQuizEnded(i + 1 >= chat?.quiz?.length || false);
      })
      setIsFinished(chat.isFinished);
    }
  }, [chat.messages]);


  const finish = () => {
    if (loadingButton) return;
    setLoadingButton(true);
    finishChat(user, chat.id).then((quiz) => {
      chat.isFinished = true;
      setIsFinished(true);
      setQuiz(quiz);
      quiz.forEach((q, i) => {
        if (q.userAnswer) setQuizInd(i + 1);
      })
    });
  }

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader sender={chat.sender} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatMessages.map((message, index) => {
            const isYou = message.sender === 'You';
            return <>
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                {message.sender !== 'You' && (
                  <AvatarWithStatus
                    online={message.sender.online}
                    src={message.sender.avatar}
                  />
                )}
                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} isSpeaking={isSpeaking} setIsSpeaking={setIsSpeaking} autoPlay={message.id == autoPlayId} />
              </Stack>
            </>
          })}

          {chatMessages.length > 1 && !isFinished &&
            <Stack
              direction="row"
              spacing={2}
              flexDirection={'row'}
              alignItems="center"

            >
              <Button loading={loadingButton} style={{ marginLeft: 48 }} onClick={finish}>understood</Button>
              <Typography level="body-xs">
                if something is not clear, do not worry, keep asking questions
              </Typography>
            </Stack>}

          {isFinished && quizInd >= 0 && quiz.map((q, i) => {
            if (i <= quizInd) {
              return <Card>
                <Typography level="body-sm">
                  {q.question}
                </Typography>
                <RadioGroup
                  defaultValue="outlined"
                  onChange={(e) => {
                    setQuiz(oq => {
                      oq[i].userAnswer = e.target.value;
                      return oq;
                    });
                    setQuizInd(i + 1);
                    if (i === quiz.length - 1) {
                      sendQuizAnswers(user, chat.id, quiz.map(q => q.userAnswer));
                      setQuizEnded(true);
                    }
                  }}
                >
                  {quizInd >= 0 && q.answers.map((text) => {
                    return <Radio
                      checked={text == quiz[i]?.userAnswer}
                      disabled={quizInd > i}
                      orientation="vertical"
                      size="md"
                      variant="solid"
                      value={text}
                      label={text} />
                  }
                  )}
                </RadioGroup>
                {quizInd > i && <Typography level="body-sm">
                  {q.answerExplanation}
                </Typography>}
              </Card>
            }
            return <></>;
          }
          )}


          {quizEnded &&
            <Stack alignItems="center">
              <Typography level="body-sm">
                <EmojiEventsIcon />  Mission completed!
              </Typography>
              <Typography level="body-sm">
                If you still have questions please open new chat!
              </Typography>
            </Stack>
          }
        </Stack>
      </Box>
      {
        !isFinished &&
        <MessageInput
          textAreaValue={textAreaValue}
          setTextAreaValue={setTextAreaValue}
          streaming={streaming}
          onSubmit={async () => {
            if (streaming) return;
            setSteaming(true);
            if (!chat.id && user && chatMessages.length == 0) {
              createChat(user).then(({ chatId: newChatId }) => {
                chat.id = newChatId;
                sendMessage(user, newChatId, textAreaValue, addMessageChunk, onEnd)
                  .then(() => navigate(`/chat/${newChatId}`))
              })
            } else if (chat.id && user) {
              sendMessage(user, chat.id, textAreaValue, addMessageChunk, onEnd)
            } else {
              setSteaming(false);
              return;
            }

            const newId = chatMessages.length + 1;
            const newIdString = newId.toString();
            setChatMessages(oms => [
              ...oms,
              {
                id: newIdString,
                sender: 'You',
                content: textAreaValue,
                timestamp: Date.now(),
              },
            ]);
          }
          }
        />
      }
    </Sheet >
  );
}
