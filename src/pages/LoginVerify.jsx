import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StatusBar from '../components/StatusBar'

export default function LoginVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const { state } = useLocation()
  const phone = state?.phone || ''

  // 倒計時
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // 自動驗證
  useEffect(() => {
    const code = otp.join('')
    if (code.length === 6) verifyOTP(code)
  }, [otp])

  function handleInput(i, val) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
    if (!val && i > 0) inputRefs.current[i - 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  async function verifyOTP(code) {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: 'sms',
    })
    if (error) {
      setError('驗證碼錯誤，請再試一次')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } else {
      // 首次登入 → 詢問 Face ID
      const faceIdEnabled = localStorage.getItem('faceid_enabled')
      const faceIdAsked = localStorage.getItem('faceid_asked')
      if (!faceIdAsked) navigate('/faceid-prompt')
      else navigate('/report')
    }
    setLoading(false)
  }

  async function resend() {
    if (countdown > 0) return
    await supabase.auth.signInWithOtp({ phone })
    setCountdown(60)
    setOtp(['', '', '', '', '', ''])
  }

  const maskedPhone = phone.replace('+886', '0').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')

  return (
    <div className="app-shell">
      <StatusBar theme="dark" />
      <div className="page-dark" style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column' }}>
        <div className="fade-up">
          <div
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            onClick={() => navigate('/login')}
          >
            ‹ 返回
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>輸入驗證碼</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.65, marginBottom: 28 }}>
            已發送至 {maskedPhone}<br />驗證碼有效 5 分鐘
          </p>

          <div className="otp-boxes">
            {otp.map((v, i) => (
              <div key={i} className={`otp-box ${!v && i === otp.findIndex(x => !x) ? 'active' : ''}`}>
                <input
                  ref={el => inputRefs.current[i] = el}
                  type="tel"
                  maxLength={1}
                  value={v}
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  style={{ background: 'none', border: 'none', outline: 'none', fontSize: 22, fontWeight: 700, color: '#fff', width: '100%', textAlign: 'center', fontFamily: 'inherit' }}
                  autoFocus={i === 0}
                />
              </div>
            ))}
          </div>

          {error && <p style={{ color: '#e07070', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
          {loading && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', marginBottom: 12 }}>驗證中⋯</p>}

          <p
            style={{ fontSize: 12, color: countdown > 0 ? 'rgba(255,255,255,0.25)' : 'var(--teal)', textAlign: 'center', cursor: countdown > 0 ? 'default' : 'pointer' }}
            onClick={resend}
          >
            {countdown > 0 ? `重新發送驗證碼（${countdown}s）` : '重新發送驗證碼'}
          </p>

          <div style={{ marginTop: 28, background: 'rgba(139,188,183,0.07)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(139,188,183,0.15)' }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginBottom: 4 }}>LINE 推播通知</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>登入後可在「我的」頁面綁定 LINE 帳號，開始接收每月月報通知</p>
          </div>
        </div>
      </div>
    </div>
  )
}
