import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const SESSIONS = [
  { date: '2025/03/05', mode: 'CST', weight: 1.5, reps: 3, peak: 2100, power: 20.1, rom: 115, avg: 1240 },
  { date: '2025/03/12', mode: 'CST', weight: 2.0, reps: 3, peak: 2580, power: 25.4, rom: 117, avg: 1520 },
  { date: '2025/03/19', mode: 'CST', weight: 2.5, reps: 3, peak: 3010, power: 29.8, rom: 118, avg: 1780 },
  { date: '2025/03/26', mode: 'CST', weight: 2.5, reps: 3, peak: 3120, power: 30.5, rom: 119, avg: 1840 },
  { date: '2025/04/02', mode: 'ECC', weight: 3.0, reps: 3, peak: 3280, power: 31.9, rom: 119, avg: 1900 },
  { date: '2025/04/09', mode: 'CST', weight: 3.0, reps: 3, peak: 3350, power: 32.6, rom: 119, avg: 1910 },
  { date: '2025/04/16', mode: 'CST', weight: 3.0, reps: 3, peak: 3426, power: 33.2, rom: 119, avg: 1920 },
]

const latest = SESSIONS[SESSIONS.length - 1]
const first = SESSIONS[0]

// 迷你折線圖
function MiniChart({ data, color, height = 44 }) {
  const min = Math.min(...data) * 0.95
  const max = Math.max(...data) * 1.05
  const w = 240, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return `${x},${y}`
  })
  const pathD = `M${pts.join(' L')}`
  const areaD = `M${pts[0]} L${pts.join(' L')} L${w},${h} L0,${h} Z`
  const lastPt = pts[pts.length - 1].split(',')
  return (
    <svg width="100%" height={h + 4} viewBox={`0 0 ${w} ${h + 4}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`ag-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#ag-${color})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="3.5" fill={color} />
    </svg>
  )
}

// 力量曲線（模擬）
function ForceCurve() {
  const pts = [0, 8, 18, 32, 44, 52, 56, 54, 48, 38, 28, 18, 10, 4, 0]
  const w = 240, h = 50
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w
    const y = h - (v / 60) * h
    return `${x},${y}`
  })
  return (
    <svg width="100%" height={h + 4} viewBox={`0 0 ${w} ${h + 4}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="fcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fcccc" stopOpacity=".2" />
          <stop offset="100%" stopColor="#9fcccc" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${coords[0]} L${coords.join(' L')} L${w},${h} L0,${h} Z`} fill="url(#fcg)" />
      <polyline points={coords.join(' ')} fill="none" stroke="#9fcccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Akuis() {
  const navigate = useNavigate()
  const [showHistory, setShowHistory] = useState(false)

  const weightDelta = latest.weight - first.weight
  const peakDelta = latest.peak - first.peak

  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: '#7a9d8a', cursor: 'pointer' }} onClick={() => navigate('/report')}>‹ 健康報告</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1e3028' }}>Akuis 肌力紀錄</div>
            <div style={{ fontSize: 11, color: '#7a9d8a', marginTop: 2 }}>最新訓練：{latest.date}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: '#e2ede6', color: '#5f846f' }}>本人專屬</div>
        </div>
      </div>

      <div className="page">
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 訓練設定 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 10 }}>訓練設定</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
              {[
                { label: '模式', value: latest.mode, color: '#66888e', bg: '#daedec' },
                { label: '重量', value: `${latest.weight}`, unit: 'kg', color: '#5f846f', bg: '#e2ede6' },
                { label: '次數', value: `${latest.reps}`, unit: '次', color: '#5f846f', bg: '#e2ede6' },
              ].map((item, i) => (
                <div key={i} style={{ background: item.bg, borderRadius: 11, padding: '9px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: item.color, opacity: .7, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: item.color }}>{item.value}<span style={{ fontSize: 9, fontWeight: 400 }}> {item.unit}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* 本次表現 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 10 }}>本次表現</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 10 }}>
              {[
                { label: '峰值出力', value: latest.peak.toLocaleString(), unit: 'mN' },
                { label: '最大功率', value: latest.power, unit: 'W' },
                { label: '動作範圍', value: latest.rom, unit: 'cm' },
                { label: '平均出力', value: latest.avg.toLocaleString(), unit: 'mN' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#f4f7f5', borderRadius: 10, padding: '9px 10px' }}>
                  <div style={{ fontSize: 9, color: '#aaa', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#1e3028' }}>{item.value} <span style={{ fontSize: 9, fontWeight: 400, color: '#aaa' }}>{item.unit}</span></div>
                </div>
              ))}
            </div>
            {/* 力量曲線 */}
            <div style={{ background: '#daedec', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(102,136,142,.2)' }}>
              <div style={{ fontSize: 10, color: '#66888e', fontWeight: 700, marginBottom: 5 }}>第一次力量曲線</div>
              <ForceCurve />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#66888e', marginTop: 3 }}>
                <span>開始</span><span>峰值</span><span>結束</span>
              </div>
            </div>
          </div>

          {/* 進步趨勢 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#aaa', letterSpacing: '.5px', marginBottom: 10 }}>進步趨勢</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <div style={{ width: 10, height: 3, borderRadius: 2, background: '#7ac19a' }} />
                <span style={{ fontSize: 11, color: '#1e3028', fontWeight: 700 }}>重量</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#5f846f', marginLeft: 'auto' }}>+{weightDelta.toFixed(1)} kg ↑</span>
              </div>
              <MiniChart data={SESSIONS.map(s => s.weight)} color="#7ac19a" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#aaa', marginTop: 2 }}>
                <span>{first.weight}kg</span><span>{latest.weight}kg</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <div style={{ width: 10, height: 3, borderRadius: 2, background: '#9fcccc' }} />
                <span style={{ fontSize: 11, color: '#1e3028', fontWeight: 700 }}>峰值出力</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#66888e', marginLeft: 'auto' }}>+{(peakDelta).toLocaleString()} mN ↑</span>
              </div>
              <MiniChart data={SESSIONS.map(s => s.peak)} color="#9fcccc" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#aaa', marginTop: 2 }}>
                <span>{first.peak.toLocaleString()}mN</span><span>{latest.peak.toLocaleString()}mN</span>
              </div>
            </div>
          </div>

          {/* 系統小結語 */}
          <div style={{ background: '#e2ede6', borderRadius: 12, border: '1px solid rgba(95,132,111,.2)', padding: '11px 13px', borderLeft: '3px solid #7ac19a' }}>
            <div style={{ fontSize: 12, color: '#1e3028', lineHeight: 1.65, fontWeight: 500 }}>
              這個月你的訓練重量從 {first.weight}kg 提升到 {latest.weight}kg，峰值出力增加 {peakDelta.toLocaleString()} mN ↑ 持續成長中！
            </div>
          </div>

          {/* 歷史紀錄 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setShowHistory(!showHistory)}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3028' }}>所有訓練紀錄</span>
              <span style={{ fontSize: 11, color: '#7a9d8a' }}>{SESSIONS.length} 次 {showHistory ? '▲' : '▼'}</span>
            </div>
            {showHistory && (
              <div style={{ borderTop: '1px solid #deeae2' }}>
                {[...SESSIONS].reverse().map((s, i) => (
                  <div key={i} style={{ padding: '9px 14px', borderBottom: i < SESSIONS.length - 1 ? '1px solid #deeae2' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e3028' }}>{s.date}</div>
                      <div style={{ fontSize: 10, color: '#aaa' }}>{s.mode} · {s.weight}kg · {s.reps}次</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#66888e' }}>{s.peak.toLocaleString()} mN</div>
                      <div style={{ fontSize: 10, color: '#aaa' }}>{s.power} W</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
