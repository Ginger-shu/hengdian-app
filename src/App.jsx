import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Login from './pages/Login'
import LoginVerify from './pages/LoginVerify'
import { FaceIDPrompt, FaceIDUnlock } from './pages/FaceID'
import Report from './pages/Report'
import Summary from './pages/Summary'
import InBody from './pages/InBody'
import Moti from './pages/Moti'
import Goals from './pages/Goals'
import Akuis from './pages/Akuis'
import Milestones from './pages/Milestones'
import { Courses, Mascot, Profile } from './pages/OtherPages'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/verify" element={<LoginVerify />} />
          <Route path="/faceid-prompt" element={<FaceIDPrompt />} />
          <Route path="/faceid-unlock" element={<FaceIDUnlock />} />

          {/* 報告六層 */}
          <Route path="/report" element={<Report />} />
          <Route path="/report/summary" element={<Summary />} />
          <Route path="/report/inbody" element={<InBody />} />
          <Route path="/report/moti" element={<Moti />} />
          <Route path="/report/goals" element={<Goals />} />
          <Route path="/report/akuis" element={<Akuis />} />
          <Route path="/report/milestones" element={<Milestones />} />

          {/* 其他頁 */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/mascot" element={<Mascot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/report" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
