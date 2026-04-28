import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StatusBar from '../components/StatusBar'

export default function Login() {
  const [tab, setTab] = useState('password') // 'password' | 'otp'
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // 帳號密碼登入
  async function handlePasswordLogin() {
    if (!phone || !password) return setError('請填入帳號和密碼')
    setLoading(true)
    setError('')
    const formattedPhone = phone.startsWith('+886') ? phone : `+886${phone.replace(/^0/, '')}`
    const { error } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password,
    })
    if (error) setError('帳號或密碼錯誤，請再試一次')
    else navigate('/report')
    setLoading(false)
  }

  // 發送 OTP
  async function handleSendOTP() {
    if (!phone) return setError('請填入手機號碼')
    setLoading(true)
    setError('')
    const formattedPhone = phone.startsWith('+886') ? phone : `+886${phone.replace(/^0/, '')}`
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone })
    if (error) setError('發送失敗，請確認手機號碼')
    else navigate('/login/verify', { state: { phone: formattedPhone } })
    setLoading(false)
  }

  return (
    <div className="app-shell">
      <StatusBar theme="dark" />
      <div className="page-dark" style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column' }}>
        <div className="logo-row fade-up">
          <div className="logo-dot" />
          <div className="logo-text">衡點<em>健康</em></div>
        </div>

        <div className="fade-up" style={{ animationDelay: '0.06s' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>歡迎回來</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginBottom: 22 }}>請登入您的帳號</p>

          <div className="login-tabs">
            <div className={`login-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => { setTab('password'); setError('') }}>帳號密碼</div>
            <div className={`login-tab ${tab === 'otp' ? 'active' : ''}`} onClick={() => { setTab('otp'); setError('') }}>手機驗證</div>
          </div>

          {/* 帳號密碼 */}
          {tab === 'password' && (
            <>
              <div className="field">
                <div className="field-label">帳號（手機號碼）</div>
                <div className="field-input focused">
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
                  />
                </div>
              </div>
              <div className="field">
                <div className="field-label">密碼</div>
                <div className="field-input focused" style={{ justifyContent: 'space-between' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="請輸入密碼"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePasswordLogin()}
                  />
                  <span className="field-action" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '隱藏' : '顯示'}
                  </span>
                </div>
              </div>
              {error && <p style={{ color: '#e07070', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}
              <button className="btn-primary" onClick={handlePasswordLogin} disabled={loading}>
                {loading ? '登入中⋯' : '登入'}
              </button>
              <p className="note">預設密碼為生日（如：19900101）<br />建議首次登入後更改密碼</p>
            </>
          )}

          {/* 手機 OTP */}
          {tab === 'otp' && (
            <>
              <div className="field">
                <div className="field-label">手機號碼</div>
                <div className="field-input focused">
                  <span className="field-prefix">+886</span>
                  <input
                    type="tel"
                    placeholder="912 345 678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
              </div>
              {error && <p style={{ color: '#e07070', fontSize: 12, marginBottom: 10, textAlign: 'center' }}>{error}</p>}
              <button className="btn-primary" onClick={handleSendOTP} disabled={loading}>
                {loading ? '發送中⋯' : '發送驗證碼'}
              </button>
              <p className="note">簡訊驗證碼有效 5 分鐘<br />忘記密碼也可用此方式登入</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
