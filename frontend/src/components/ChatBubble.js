import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { timestampToNiceText, formatMessageText } from '../utils';
import CampaignIcon from '@mui/icons-material/Campaign';
import StopCircleIcon from '@mui/icons-material/StopCircle';

export default function ChatBubble(props) {
  const { id, content, variant, timestamp, attachment = undefined, sender, isSpeaking, setIsSpeaking, autoPlay } = props;
  const isSent = variant === 'sent';
  const [isHovered, setIsHovered] = React.useState(false);
  const isYou = sender === 'You';

  const clickAudio = async () => {
    if (!isSpeaking || id !== isSpeaking) {
      if (isSpeaking) speechSynthesis.cancel();
      const textToSpeak = content;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      let voices = [];
      while (voices.length === 0) {
        voices = speechSynthesis.getVoices();
        await new Promise(r => setTimeout(r, 50));
      }
      utterance.voice = voices[1];
      utterance.pitch = 1;
      utterance.rate = 1.5;
      speechSynthesis.speak(utterance);
      setIsSpeaking(id);
    } else {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  React.useEffect(() => {
    if (autoPlay) clickAudio();
  }, [autoPlay]);

  return (
    <Box sx={{ maxWidth: '60%', minWidth: 'auto' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography level="body-xs">
          {sender === 'You' ? sender : sender.name}
        </Typography>
        <Typography level="body-xs">{isNaN(timestamp) ? timestamp : timestampToNiceText(timestamp)}</Typography>
      </Stack>
      {attachment ? (
        <Sheet
          variant="outlined"
          sx={{
            px: 1.75,
            py: 1.25,
            borderRadius: 'lg',
            borderTopRightRadius: isSent ? 0 : 'lg',
            borderTopLeftRadius: isSent ? 'lg' : 0,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar color="primary" size="lg">
              <InsertDriveFileRoundedIcon />
            </Avatar>
            <div>
              <Typography fontSize="sm">{attachment.fileName}</Typography>
              <Typography level="body-sm">{attachment.size}</Typography>
            </div>
          </Stack>
        </Sheet>
      ) : (
        <Box
          sx={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sheet
            color={isSent ? 'primary' : 'neutral'}
            variant={isSent ? 'solid' : 'soft'}
            sx={{
              p: 1.25,
              borderRadius: 'lg',
              borderTopRightRadius: isSent ? 0 : 'lg',
              borderTopLeftRadius: isSent ? 'lg' : 0,
              backgroundColor: isSent
                ? 'var(--joy-palette-primary-solidBg)'
                : 'background.body',
            }}
          >
            <Typography
              level="body-sm"
              sx={{
                color: isSent
                  ? 'var(--joy-palette-common-white)'
                  : 'var(--joy-palette-text-primary)',
              }}
            >
              {formatMessageText(content)}
            </Typography>
            {!isYou &&
              <IconButton
                variant={isSpeaking ? 'soft' : 'plain'}
                color={isSpeaking ? 'warning' : 'neutral'}
                size="sm"
                onClick={clickAudio}
              >
                {id === isSpeaking ? <StopCircleIcon /> : <CampaignIcon />}
              </IconButton>
            }
          </Sheet>
        </Box>
      )}
    </Box>
  );
}
