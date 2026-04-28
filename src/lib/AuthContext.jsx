import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// ── 開發模式：假資料，跳過登入 ──
const DEV_MEMBER = {
  id: 'dev-001',
  name: '陳小明',
  member_code: 'HD-001',
  join_date: '2024-11-01',
  uses_akuis: true,
  line_id: 'U123456',
  phone: '0912345678',
}

export function AuthProvider({ children }) {
  const [member] = useState(DEV_MEMBER)

  function signOut() {
    // 開發模式不做任何事
    console.log('dev mode: signOut called')
  }

  return (
    <AuthContext.Provider value={{ session: { user: { id: 'dev' } }, member, loading: false, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
