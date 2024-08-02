// import './App.css';
import { Route, Routes, useLocation } from "react-router-dom";
import AgentChatContainer from "./pages/AgentChat/AgentChatContainer";
import AgentDashboard from "./pages/AgentDashboard/AgentDashboard";
import Sidebar from "./components/Sidebar";
import AllCases from "./pages/caseManagement/allCases/AllCases";
import ActiveCases from "./pages/caseManagement/activeCases/ActiveCases";
import ClosedCases from "./pages/caseManagement/closedCases/ClosedCases";
import AgentProfile from "./pages/AgentProfile";
import AgentLogin from "./pages/AgentLogin";
import AgentSignUp from "./pages/AgentSignUp";
import AgentStart from "./pages/AgentStart";
import AuthProvider from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  const location = useLocation();
  const hideSidebarPaths = ["/login", "/signup", "/"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);
  return (
    <AuthProvider>
      <div className="md:flex">
        {!shouldHideSidebar && <Sidebar />}
        <div className="bg-white flex-1 h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<AgentStart />} />
            <Route path="/login" element={<AgentLogin />} />
            <Route path="/signup" element={<AgentSignUp />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/AgentDashboard" element={<AgentDashboard />} />
              <Route path="/CaseManagement" element={<AllCases />} />
              <Route
                path="/CaseManagement/ActiveCases"
                element={<ActiveCases />}
              />
              <Route
                path="/CaseManagement/ClosedCases"
                element={<ClosedCases />}
              />
              <Route path="/AgentChat" element={<AgentChatContainer />} />
              <Route path="/AgentProfile" element={<AgentProfile />} />
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;

 