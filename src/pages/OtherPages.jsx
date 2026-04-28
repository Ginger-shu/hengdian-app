import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'

export function Courses() {
  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <TopBar />
      <div style={{ background: 'var(--white)', padding: '10px 16px 12px', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)' }}>課程紀錄</div>
      </div>
      <div className="page">
        <div className="placeholder-page">
          <div className="placeholder-icon">📅</div>
          <div className="placeholder-title">課程紀錄</div>
          <div className="placeholder-desc">出席歷史、各課種紀錄<br />Akuis 動作詳細記錄</div>
          <div className="placeholder-badge">Week 6+ 開發</div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export function Mascot() {
  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <TopBar />
      <div style={{ background: 'var(--white)', padding: '10px 16px 12px', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)' }}>衡仔的世界</div>
      </div>
      <div className="page">
        <div className="placeholder-page">
          <div className="placeholder-icon">🌿</div>
          <div className="placeholder-title">衡仔</div>
          <div className="placeholder-desc">遊戲化系統<br />獸幣、場景成長、日常情境選擇</div>
          <div className="placeholder-badge">設計確認後開發</div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export function Profile() {
  const { member, signOut } = useAuth()
  const navigate = useNavigate()
  const faceIdEnabled = localStorage.getItem('faceid_enabled') === 'true'

  const monthsJoined = member?.join_date
    ? Math.floor((Date.now() - new Date(member.join_date)) / (1000 * 60 * 60 * 24 * 30))
    : 0

  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <TopBar points={1240} />
      <div style={{ background: 'var(--white)', padding: '10px 16px 12px', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)' }}>我的</div>
      </div>
      <div className="page">
        {/* 個人資訊 */}
        <div style={{ padding: '14px 14px 0' }}>
          <div style={{ background: 'var(--white)', borderRadius: 14, border: '1px solid var(--bdr)', padding: '14px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--g-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'var(--g-d)', border: '1.5px solid var(--g)', flexShrink: 0 }}>
              {member?.name?.charAt(0) || '學'}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)' }}>{member?.name || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--mu)', marginTop: 2 }}>
                {member?.member_code || '—'} · 入會 {monthsJoined} 個月
              </div>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-row">
            <span className="settings-label">Face ID 登入</span>
            <span className={`settings-value ${faceIdEnabled ? 'settings-ok' : 'settings-warn'}`}>
              {faceIdEnabled ? '已開啟' : '未開啟'}
            </span>
          </div>
          <div className="settings-row">
            <span className="settings-label">LINE 推播通知</span>
            <span className={`settings-value ${member?.line_id ? 'settings-ok' : 'settings-warn'}`}>
              {member?.line_id ? '已綁定' : '未綁定'}
            </span>
          </div>
          <div className="settings-row" onClick={() => navigate('/change-password')}>
            <span className="settings-label">更改密碼</span>
            <span className="settings-arrow">›</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">隱私政策</span>
            <span className="settings-arrow">›</span>
          </div>
          <div className="settings-row">
            <span className="settings-label">使用條款</span>
            <span className="settings-arrow">›</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '14px', fontSize: 11, color: 'var(--bdr)' }}>
          衡點健康 v1.0.0
        </div>

        <div style={{ margin: '0 14px', textAlign: 'center', padding: '14px', fontSize: 14, fontWeight: 800, color: 'var(--err)', cursor: 'pointer' }}
          onClick={() => { signOut(); navigate('/login') }}>
          登出
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
