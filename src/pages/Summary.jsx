import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import { useState } from 'react'

const TIME_TABS = ['週', '月', '至今']

const DATA = {
  0: { score: 78, delta: 3, grade: '良好', streak: 3, classes: 6, fullWeeks: 1, weightDelta: -0.2, pr: 0 },
  1: { score: 82, delta: 5, grade: '優秀', streak: 8, classes: 23, fullWeeks: 4, weightDelta: -0.5, pr: 1 },
  2: { score: 82, delta: 12, grade: '優秀', streak: 8, classes: 148, fullWeeks: 32, weightDelta: -3.8, pr: 4 },
}

const GRADE_COLOR = { '優秀': '#5f846f', '良好': '#ba9e60', '需加油': '#c67566' }
const GRADE_BG = { '優秀': '#e2ede6', '良好': '#fcf4e3', '需加油': '#faece8' }

function RingChart({ score }) {
  const r = 44, circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width="106" height="106" viewBox="0 0 106 106">
      <circle cx="53" cy="53" r={r} fill="none" stroke="#deeae2" strokeWidth="8" />
      <circle cx="53" cy="53" r={r} fill="none" stroke="#7ac19a" strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 53 53)" style={{ transition: 'stroke-dashoffset .6s ease' }} />
      <text x="53" y="49" textAnchor="middle" fontSize="24" fontWeight="900" fill="#1e3028" fontFamily="Noto Sans TC">{score}</text>
      <text x="53" y="64" textAnchor="middle" fontSize="11" fill="#7a9d8a" fontFamily="Noto Sans TC">/ 100</text>
    </svg>
  )
}

export default function Summary() {
  const [tab, setTab] = useState(1)
  const { member } = useAuth()
  const navigate = useNavigate()
  const d = DATA[tab]

  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <div style={{ background: 'var(--white)', padding: '10px 16px 12px', borderBottom: '1px solid var(--bdr)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: '#7a9d8a', cursor: 'pointer' }} onClick={() => navigate('/report')}>‹ 健康報告</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#1e3028', marginBottom: 8 }}>摘要 + 身心平衡指數</div>
        <div className="time-tabs">
          {TIME_TABS.map((t, i) => (
            <div key={t} className={`time-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</div>
          ))}
        </div>
      </div>

      <div className="page">
        <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 身心平衡指數 */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #deeae2', padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
            <RingChart score={d.score} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>身心平衡指數</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#1e3028', lineHeight: 1 }}>{d.score}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#5f846f' }}>↑ +{d.delta}</span>
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: GRADE_BG[d.grade], color: GRADE_COLOR[d.grade] }}>{d.grade}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: '#fcf4e3', color: '#ba9e60' }}>🔥 {d.streak}週</span>
              </div>
            </div>
          </div>

          {/* KPI 四格 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: tab === 0 ? '本週堂次' : tab === 1 ? '本月堂次' : '累積堂次', value: d.classes, unit: '堂', color: '#5f846f', bg: '#e2ede6' },
              { label: '全勤週', value: `${d.fullWeeks}週`, color: '#5f846f', bg: '#e2ede6' },
              { label: '體重變化', value: `${d.weightDelta > 0 ? '+' : ''}${d.weightDelta}`, unit: 'kg', color: d.weightDelta < 0 ? '#5f846f' : '#c67566', bg: d.weightDelta < 0 ? '#e2ede6' : '#faece8' },
              { label: 'PR 紀錄', value: `${d.pr} 🎉`, color: '#ba9e60', bg: '#fcf4e3' },
            ].map((k, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 13, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: k.color, lineHeight: 1, marginBottom: 5 }}>{k.value}{k.unit && <span style={{ fontSize: 11, fontWeight: 400, color: '#aaa' }}> {k.unit}</span>}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* 各層快速預覽 */}
          <div style={{ fontSize: 12, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginTop: 2 }}>各層快覽</div>
          {[
            { emoji: '📊', title: 'InBody 體組成', sub: '體脂 18.2% · 骨骼肌↑0.4kg', path: '/report/inbody', bg: '#daedec' },
            { emoji: '🦴', title: 'MOTI 姿勢評估', sub: '風險指數 23 · 維持穩定', path: '/report/moti', bg: '#daedec' },
            { emoji: '🎯', title: '目標追蹤', sub: '體脂目標 82% · 骨骼肌 67%', path: '/report/goals', bg: '#fcf4e3' },
            { emoji: '⭐', title: '里程碑記憶卡', sub: '本月達成 3 個', path: '/report/milestones', bg: '#faece8' },
          ].map((item, i) => (
            <div key={i} className="layer-row" onClick={() => navigate(item.path)}>
              <div className="layer-icon" style={{ background: item.bg }}>{item.emoji}</div>
              <div className="layer-info">
                <div className="layer-title">{item.title}</div>
                <div className="layer-sub">{item.sub}</div>
              </div>
              <div className="layer-arr">›</div>
            </div>
          ))}
          <div style={{ height: 8 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
