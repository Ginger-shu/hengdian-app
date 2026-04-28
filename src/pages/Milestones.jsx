import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const MILESTONES = [
  { date: '2024/11/01', emoji: '🌱', title: '開始旅程', desc: '入會衡點健康', type: 'start', color: '#e2ede6', border: 'rgba(95,132,111,.2)' },
  { date: '2024/12/15', emoji: '🔥', title: '連週 4 週', desc: '每週至少出席一次', type: 'streak', color: '#fcf4e3', border: 'rgba(186,158,96,.2)' },
  { date: '2025/01/20', emoji: '💪', title: '深蹲 PR 50kg', desc: '首次突破個人紀錄', type: 'pr', color: '#daedec', border: 'rgba(102,136,142,.2)' },
  { date: '2025/02/10', emoji: '⭐', title: '體脂率降至 20%', desc: '體脂率首次進入健康區間', type: 'goal', color: '#faece8', border: 'rgba(198,117,102,.2)' },
  { date: '2025/03/01', emoji: '🔥', title: '連週 8 週', desc: '連續出席滿 8 週', type: 'streak', color: '#fcf4e3', border: 'rgba(186,158,96,.2)' },
  { date: '2025/04/05', emoji: '🏃', title: '累積 50 堂', desc: '總出席堂次突破 50', type: 'attendance', color: '#e2ede6', border: 'rgba(95,132,111,.2)' },
  { date: '2025/05/18', emoji: '💪', title: '深蹲 PR 60kg', desc: '再次突破個人紀錄', type: 'pr', color: '#daedec', border: 'rgba(102,136,142,.2)' },
  { date: '2025/06/01', emoji: '🔥', title: '連週 8 週（再次）', desc: '挑戰再次成功', type: 'streak', color: '#fcf4e3', border: 'rgba(186,158,96,.2)' },
  { date: '2025/06/10', emoji: '⭐', title: '體脂進健康區間', desc: '體脂率 18.2%，維持正常區間', type: 'goal', color: '#faece8', border: 'rgba(198,117,102,.2)' },
  { date: '2025/06/18', emoji: '🏆', title: '深蹲 PR 65kg', desc: '8 個月最佳紀錄', type: 'pr', color: '#daedec', border: 'rgba(102,136,142,.2)' },
]

const thisMonth = MILESTONES.filter(m => m.date.startsWith('2025/06'))

export default function Milestones() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: '#7a9d8a', cursor: 'pointer' }} onClick={() => navigate('/report')}>‹ 健康報告</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1e3028' }}>里程碑記憶卡</div>
            <div style={{ fontSize: 11, color: '#7a9d8a', marginTop: 2 }}>8 個月 · {MILESTONES.length} 個里程碑</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#ba9e60', lineHeight: 1 }}>{MILESTONES.length}</div>
            <div style={{ fontSize: 10, color: '#aaa' }}>累積成就</div>
          </div>
        </div>
      </div>

      <div className="page">
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* 本月卡片橫排 */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 8 }}>本月達成 {thisMonth.length} 個</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {thisMonth.map((m, i) => (
                <div key={i} style={{ flexShrink: 0, width: 90, background: m.color, borderRadius: 13, padding: '10px', border: `1px solid ${m.border}` }}>
                  <div style={{ fontSize: 9, color: '#aaa', marginBottom: 3 }}>{m.date.slice(5)}</div>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{m.emoji}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3028', lineHeight: 1.3 }}>{m.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 統計小卡 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
            {[
              { label: '連週紀錄', value: MILESTONES.filter(m => m.type === 'streak').length, emoji: '🔥', bg: '#fcf4e3', color: '#ba9e60' },
              { label: 'PR 突破', value: MILESTONES.filter(m => m.type === 'pr').length, emoji: '💪', bg: '#daedec', color: '#66888e' },
              { label: '目標達成', value: MILESTONES.filter(m => m.type === 'goal').length, emoji: '⭐', bg: '#faece8', color: '#c67566' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 11, padding: '10px 8px', textAlign: 'center', border: `1px solid ${s.color}30` }}>
                <div style={{ fontSize: 15, marginBottom: 3 }}>{s.emoji}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: '#aaa', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* 完整時間軸 */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 8 }}>完整旅程記錄</div>
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              {[...MILESTONES].reverse().map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderBottom: i < MILESTONES.length - 1 ? '1px solid #deeae2' : 'none' }}>
                  {/* 左側時間線 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: `1px solid ${m.border}` }}>
                      {m.emoji}
                    </div>
                  </div>
                  {/* 右側內容 */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: '#aaa', marginBottom: 2 }}>{m.date}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3028', marginBottom: 2 }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: '#7a9d8a' }}>{m.desc}</div>
                  </div>
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
