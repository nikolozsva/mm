import { Routes, Route } from "react-router-dom";

import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Kyc from './pages/Kyc'
import Chat from './pages/Chat'
import ForgotPassword from './pages/ForgotPassword'

import { ThemeProvider, createTheme } from '@mui/material/styles';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/kyc" element={<Kyc />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
