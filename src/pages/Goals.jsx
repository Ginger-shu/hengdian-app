import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const GOALS = [
  { emoji: '🔥', label: '體脂率', start: 22.1, current: 18.2, target: 15.0, unit: '%', color: '#9fcccc', better: 'down' },
  { emoji: '💪', label: '骨骼肌重', start: 28.4, current: 30.2, target: 33.0, unit: 'kg', color: '#7ac19a', better: 'up' },
  { emoji: '🧘', label: '核心穩定評分', start: 50, current: 87, target: 90, unit: '分', color: '#f2ac98', better: 'up' },
]

function GoalCard({ goal, showDetail, onToggle }) {
  const isDown = goal.better === 'down'
  const total = Math.abs(goal.target - goal.start)
  const done = Math.abs(goal.current - goal.start)
  const pct = Math.min(Math.round((done / total) * 100), 100)
  const reached = pct >= 100
  const remaining = Math.abs(goal.target - goal.current)

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
      <div style={{ padding: '13px 14px', cursor: 'pointer' }} onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 18 }}>{goal.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3028' }}>{goal.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {reached
              ? <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 9, background: '#e2ede6', color: '#5f846f' }}>已達標 ✓</span>
              : <span style={{ fontSize: 18, fontWeight: 900, color: '#5f846f' }}>{pct}%</span>
            }
            <span style={{ fontSize: 12, color: '#ccc' }}>{showDetail ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* 進度條 */}
        <div style={{ height: 8, background: '#f4f7f5', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: goal.color, borderRadius: 4, transition: 'width .5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span style={{ color: '#aaa' }}>入會 {goal.start}{goal.unit}</span>
          <span style={{ color: '#1e3028', fontWeight: 700 }}>現在 {goal.current}{goal.unit}</span>
          <span style={{ color: '#aaa' }}>目標 {goal.target}{goal.unit}</span>
        </div>
      </div>

      {/* 展開對比 */}
      {showDetail && (
        <div style={{ borderTop: '1px solid #deeae2', padding: '12px 14px', background: '#f9fbfa' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[
              { label: '入會時', value: `${goal.start}${goal.unit}`, color: '#aaa' },
              { label: '目前', value: `${goal.current}${goal.unit}`, color: '#1e3028', bold: true },
              { label: '目標', value: `${goal.target}${goal.unit}`, color: '#5f846f' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', background: '#fff', borderRadius: 10, padding: '8px 6px', border: '1px solid #deeae2' }}>
                <div style={{ fontSize: 9, color: '#aaa', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: item.bold ? 900 : 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#7a9d8a', textAlign: 'center', fontWeight: 700 }}>
            {reached ? '🎉 目標達成！' : `再 ${remaining.toFixed(1)}${goal.unit} 達標`}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Goals() {
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = useState(null)

  const totalPct = Math.round(GOALS.reduce((sum, g) => {
    const total = Math.abs(g.target - g.start)
    const done = Math.abs(g.current - g.start)
    return sum + Math.min(done / total, 1)
  }, 0) / GOALS.length * 100)

  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: '#7a9d8a', cursor: 'pointer' }} onClick={() => navigate('/report')}>‹ 健康報告</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1e3028' }}>目標追蹤</div>
            <div style={{ fontSize: 11, color: '#7a9d8a', marginTop: 2 }}>入會至今 · 8 個月</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#5f846f', lineHeight: 1 }}>{totalPct}%</div>
            <div style={{ fontSize: 10, color: '#aaa' }}>整體進度</div>
          </div>
        </div>
      </div>

      <div className="page">
        <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 整體進度條 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>整體目標完成度</div>
            <div style={{ height: 10, background: '#f4f7f5', borderRadius: 5, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: `${totalPct}%`, height: '100%', borderRadius: 5, background: 'linear-gradient(90deg, #7ac19a, #9fcccc)', transition: 'width .6s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
              <span>入會 2024/11</span>
              <span style={{ color: '#5f846f', fontWeight: 700 }}>{totalPct}% 完成</span>
              <span>目標達成</span>
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700, letterSpacing: '.5px' }}>點擊各項目查看詳細對比</div>

          {GOALS.map((goal, i) => (
            <GoalCard
              key={i}
              goal={goal}
              showDetail={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}

          {/* 近期數據摘要 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3028', marginBottom: 10 }}>8 個月成果</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
              {[
                { label: '體重', value: '-3.8', unit: 'kg', color: '#5f846f' },
                { label: '深蹲 PR', value: '+25', unit: 'kg', color: '#5f846f' },
                { label: '累積堂次', value: '148', unit: '堂', color: '#ba9e60' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#f4f7f5', borderRadius: 10, padding: '9px 7px', textAlign: 'center' }}>
                  <div style={{ fontSize: 17, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: '#aaa', marginTop: 3 }}>{s.label} {s.unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
