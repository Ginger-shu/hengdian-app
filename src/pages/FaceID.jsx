import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'

// ── 首次登入後詢問是否開啟 Face ID ──
export function FaceIDPrompt() {
  const navigate = useNavigate()

  async function enable() {
    try {
      // WebAuthn / Passkey 註冊
      if (window.PublicKeyCredential) {
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rp: { name: '衡點健康', id: window.location.hostname },
            user: {
              id: crypto.getRandomValues(new Uint8Array(16)),
              name: 'member',
              displayName: '學員',
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required',
            },
          },
        })
        if (credential) {
          localStorage.setItem('faceid_enabled', 'true')
          localStorage.setItem('faceid_credential_id', btoa(String.fromCharCode(...new Uint8Array(credential.rawId))))
        }
      }
    } catch (e) {
      // 裝置不支援或使用者取消
      console.log('Face ID 未啟用:', e.message)
    }
    localStorage.setItem('faceid_asked', 'true')
    navigate('/report')
  }

  function skip() {
    localStorage.setItem('faceid_asked', 'true')
    navigate('/report')
  }

  return (
    <div className="app-shell">
      <StatusBar theme="dark" />
      <div className="faceid-screen fade-up">
        <div className="faceid-icon-wrap">
          <FaceIDIcon />
        </div>
        <h2 className="faceid-title">開啟 Face ID？</h2>
        <p className="faceid-desc">下次打開 App 時直接用臉部辨識快速進入，不需輸入密碼</p>
        <button className="btn-primary" style={{ maxWidth: 280 }} onClick={enable}>
          開啟 Face ID
        </button>
        <button className="btn-ghost" onClick={skip}>暫時不要</button>
      </div>
    </div>
  )
}

// ── 之後每次進入 App 的解鎖畫面 ──
export function FaceIDUnlock() {
  const navigate = useNavigate()

  async function authenticate() {
    try {
      if (window.PublicKeyCredential) {
        await navigator.credentials.get({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            userVerification: 'required',
          },
        })
        navigate('/report')
      }
    } catch (e) {
      // 辨識失敗 → 退回密碼登入
      console.log('Face ID 失敗:', e.message)
      navigate('/login')
    }
  }

  // 頁面載入即自動觸發
  useState(() => { setTimeout(authenticate, 500) }, [])

  return (
    <div className="app-shell">
      <div className="faceid-unlock fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 52 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--teal)', opacity: 0.8 }} />
          <span style={{ fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,0.75)' }}>
            衡點<span style={{ color: 'var(--teal)' }}>健康</span>
          </span>
        </div>

        <div className="fid-scan-wrap" onClick={authenticate} style={{ cursor: 'pointer' }}>
          <div className="fid-border" />
          <div className="fid-corner tl" />
          <div className="fid-corner tr" />
          <div className="fid-corner bl" />
          <div className="fid-corner br" />
          <div className="fid-scan-line" />
          <div className="fid-dot l" />
          <div className="fid-dot r" />
          <div className="fid-mouth-line" />
        </div>

        <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Face ID 辨識中</p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 52 }}>請將臉部對準鏡頭</p>
        <p className="fid-fallback" onClick={() => navigate('/login')}>改用帳號密碼登入</p>
      </div>
    </div>
  )
}

// Face ID SVG icon
function FaceIDIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <rect x="2" y="2" width="10" height="3.5" rx="1.75" stroke="rgba(139,188,183,0.75)" strokeWidth="1.5"/>
      <rect x="30" y="2" width="10" height="3.5" rx="1.75" stroke="rgba(139,188,183,0.75)" strokeWidth="1.5"/>
      <rect x="2" y="36.5" width="10" height="3.5" rx="1.75" stroke="rgba(139,188,183,0.75)" strokeWidth="1.5"/>
      <rect x="30" y="36.5" width="10" height="3.5" rx="1.75" stroke="rgba(139,188,183,0.75)" strokeWidth="1.5"/>
      <circle cx="14.5" cy="18" r="2.5" fill="rgba(139,188,183,0.75)"/>
      <circle cx="27.5" cy="18" r="2.5" fill="rgba(139,188,183,0.75)"/>
      <path d="M14.5 27.5 Q21 33 27.5 27.5" stroke="rgba(139,188,183,0.75)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M21 21 L21 25" stroke="rgba(139,188,183,0.55)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
