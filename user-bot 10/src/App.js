import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserAgentChat from "./pages/UserAgentChat";
import UserBotChat from "./pages/UserBotChat";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import AuthProvider from "./AuthContext";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/userbotchat" element={<UserBotChat />} />
          <Route path="/useragentchat" element={<UserAgentChat />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
 