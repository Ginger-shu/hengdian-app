import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import StatusBar from '../components/StatusBar'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'

const TIME_TABS = ['週', '月', '至今']

const LAYERS = [
  { emoji: '🧘', title: '摘要 + 身心平衡指數', sub: '全自動計算',        path: '/report/summary',    bg: 'var(--g-l)',  cond: false },
  { emoji: '📊', title: 'InBody 體組成',        sub: '折線圖 · 正常範圍', path: '/report/inbody',     bg: 'var(--b-l)',  cond: false },
  { emoji: '🦴', title: 'MOTI 姿勢評估',        sub: '骨架圖 · 風險指數', path: '/report/moti',       bg: 'var(--b-l)',  cond: false },
  { emoji: '🎯', title: '目標追蹤',             sub: '入會目標進度條',    path: '/report/goals',      bg: 'var(--y-l)', cond: false },
  { emoji: '💪', title: 'Akuis 肌力紀錄',      sub: 'CSV 自動同步',      path: '/report/akuis',      bg: 'var(--g-l)',  cond: true  },
  { emoji: '⭐', title: '里程碑記憶卡',         sub: '系統自動偵測',      path: '/report/milestones', bg: 'var(--p-l)',  cond: false },
]

export default function Report() {
  const [timeTab, setTimeTab] = useState(1)
  const { member } = useAuth()
  const navigate = useNavigate()
  const greetMap = ['這週', '本月', '入會至今']

  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <TopBar points={1240} />

      {/* 報告標題列 */}
      <div style={{ background: 'var(--white)', padding: '10px 16px 0', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--mu)', marginBottom: 1 }}>{greetMap[timeTab]}報告</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ink)' }}>{member?.name || '學員'}的健康旅程</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--g-l)', border: '1.5px solid var(--g)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--g-d)' }}>
            {member?.name?.charAt(0) || '學'}
          </div>
        </div>
        <div className="time-tabs" style={{ paddingBottom: 10 }}>
          {TIME_TABS.map((t, i) => (
            <div key={t} className={`time-tab ${timeTab === i ? 'active' : ''}`} onClick={() => setTimeTab(i)}>{t}</div>
          ))}
        </div>
      </div>

      <div className="page">
        <div className="report-body">
          {LAYERS.map(layer => {
            if (layer.cond && !member?.uses_akuis) return null
            return (
              <div key={layer.emoji} className="layer-row" onClick={() => navigate(layer.path)}>
                <div className="layer-icon" style={{ background: layer.bg }}>{layer.emoji}</div>
                <div className="layer-info">
                  <div className="layer-title">{layer.title}</div>
                  <div className="layer-sub">{layer.sub}</div>
                </div>
                {layer.cond && <div className="layer-cond">專屬</div>}
                <div className="layer-arr">›</div>
              </div>
            )
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
