import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

// ── 假資料（之後換成 Supabase 查詢）──
const INBODY_HISTORY = [
  { date: '2024/11/05', weight: 66.2, bodyFat: 22.1, muscle: 28.4, bmi: 24.2, visceral: 8, water: { in: 20.1, out: 10.2, total: 30.3 }, protein: 8.8, mineral: 3.28, whr: 0.82 },
  { date: '2024/12/10', weight: 65.5, bodyFat: 21.3, muscle: 28.8, bmi: 23.9, visceral: 7, water: { in: 20.4, out: 10.4, total: 30.8 }, protein: 9.0, mineral: 3.32, whr: 0.81 },
  { date: '2025/01/14', weight: 64.8, bodyFat: 20.5, muscle: 29.2, bmi: 23.7, visceral: 7, water: { in: 20.8, out: 10.6, total: 31.4 }, protein: 9.2, mineral: 3.35, whr: 0.80 },
  { date: '2025/02/18', weight: 64.0, bodyFat: 19.8, muscle: 29.6, bmi: 23.4, visceral: 7, water: { in: 21.1, out: 10.8, total: 31.9 }, protein: 9.4, mineral: 3.38, whr: 0.79 },
  { date: '2025/03/20', weight: 63.5, bodyFat: 19.2, muscle: 29.9, bmi: 23.2, visceral: 6, water: { in: 21.4, out: 10.9, total: 32.3 }, protein: 9.5, mineral: 3.40, whr: 0.78 },
  { date: '2025/04/22', weight: 63.0, bodyFat: 18.8, muscle: 30.0, bmi: 23.0, visceral: 6, water: { in: 21.7, out: 11.1, total: 32.8 }, protein: 9.6, mineral: 3.41, whr: 0.77 },
  { date: '2025/05/08', weight: 62.8, bodyFat: 19.0, muscle: 29.8, bmi: 22.9, visceral: 6, water: { in: 21.5, out: 11.0, total: 32.5 }, protein: 9.5, mineral: 3.40, whr: 0.77 },
  { date: '2025/06/10', weight: 62.4, bodyFat: 18.2, muscle: 30.2, bmi: 22.8, visceral: 6, water: { in: 22.1, out: 11.3, total: 33.4 }, protein: 9.6, mineral: 3.42, whr: 0.76 },
]

// 性別（之後從 member 資料取得）
const GENDER = 'female'

// 正常範圍（WHO / 衛福部標準）
const NORMAL = {
  bodyFat: GENDER === 'female' ? { low: 18, normal: [18, 28], high: 28, vhigh: 35 } : { low: 10, normal: [10, 20], high: 20, vhigh: 25 },
  bmi: { low: 18.5, normal: [18.5, 24.9], high: 25, vhigh: 30 },
  whr: GENDER === 'female' ? { normal: 0.80, risk: 0.85 } : { normal: 0.90, risk: 0.95 },
  visceral: { normal: [1, 9], high: 10 },
}

// SVG 折線圖（迷你）
function LineChart({ data, color, height = 52, showDots = true }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data) * 0.97
  const max = Math.max(...data) * 1.03
  const w = 260, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return `${x},${y}`
  })
  const pathD = `M${pts.join(' L')}`
  const areaD = `M${pts[0]} L${pts.join(' L')} L${w},${h} L0,${h} Z`
  const lastPt = pts[pts.length - 1].split(',')

  return (
    <svg width="100%" height={h + 6} viewBox={`0 0 ${w} ${h + 6}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {showDots && (
        <circle cx={lastPt[0]} cy={lastPt[1]} r="3.5" fill={color} />
      )}
    </svg>
  )
}

// 正常範圍色帶
function RangeBar({ value, type }) {
  const ranges = {
    bodyFat: {
      sections: [
        { label: '偏低', color: '#b8dcd8', width: 15 },
        { label: '正常', color: '#7ac19a', width: 30 },
        { label: '偏高', color: '#ffe08b', width: 30 },
        { label: '過高', color: '#f2ac98', width: 25 },
      ],
      getLabel: (v) => v < 18 ? '偏低' : v <= 28 ? '正常 ✓' : v <= 35 ? '偏高' : '過高',
      getColor: (v) => v < 18 ? '#66888e' : v <= 28 ? '#5f846f' : v <= 35 ? '#ba9e60' : '#c67566',
    },
    bmi: {
      sections: [
        { label: '過輕', color: '#b8dcd8', width: 18 },
        { label: '正常', color: '#7ac19a', width: 32 },
        { label: '過重', color: '#ffe08b', width: 25 },
        { label: '肥胖', color: '#f2ac98', width: 25 },
      ],
      getLabel: (v) => v < 18.5 ? '過輕' : v <= 24.9 ? '正常 ✓' : v <= 29.9 ? '過重' : '肥胖',
      getColor: (v) => v < 18.5 ? '#66888e' : v <= 24.9 ? '#5f846f' : v <= 29.9 ? '#ba9e60' : '#c67566',
    },
    whr: {
      sections: [
        { label: '正常', color: '#7ac19a', width: 45 },
        { label: '風險', color: '#ffe08b', width: 25 },
        { label: '高風險', color: '#f2ac98', width: 30 },
      ],
      getLabel: (v) => v < 0.80 ? '正常 ✓' : v < 0.85 ? '風險' : '高風險',
      getColor: (v) => v < 0.80 ? '#5f846f' : v < 0.85 ? '#ba9e60' : '#c67566',
    },
  }

  const r = ranges[type]
  if (!r) return null
  const label = r.getLabel(value)
  const labelColor = r.getColor(value)

  return (
    <div>
      <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
        {r.sections.map((s, i) => (
          <div key={i} style={{ width: `${s.width}%`, background: s.color }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
        {r.sections.map((s, i) => (
          <span key={i} style={{ color: s.label === label.replace(' ✓', '') ? labelColor : '#aaa', fontWeight: s.label === label.replace(' ✓', '') ? 700 : 400 }}>
            {i === r.sections.findIndex(x => x.label === label.replace(' ✓', '')) ? label : s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// 主指標卡片
function MainMetricCard({ label, value, unit, delta, deltaLabel, chartData, color, rangeType, standard }) {
  const isPositive = (label === '骨骼肌重') ? delta > 0 : delta < 0
  const deltaColor = isPositive ? '#5f846f' : delta === 0 ? '#aaa' : '#c67566'
  const deltaPrefix = delta > 0 ? '+' : ''

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '13px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3028' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#1e3028', lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 11, color: '#aaa' }}>{unit}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: deltaColor }}>{deltaPrefix}{delta}</span>
        </div>
      </div>
      {rangeType && <RangeBar value={value} type={rangeType} />}
      {standard && <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>{standard}</div>}
      <div style={{ marginTop: 8 }}>
        <LineChart data={chartData} color={color} height={48} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#bbb', marginTop: 2 }}>
        <span>{INBODY_HISTORY[0].date}</span>
        <span>{INBODY_HISTORY[INBODY_HISTORY.length - 1].date}</span>
      </div>
    </div>
  )
}

export default function InBody() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('chart') // 'chart' | 'compare'
  const [showSecondary, setShowSecondary] = useState(false)

  const latest = INBODY_HISTORY[INBODY_HISTORY.length - 1]
  const prev = INBODY_HISTORY[INBODY_HISTORY.length - 2]

  const diff = (key) => Math.round((latest[key] - prev[key]) * 10) / 10

  return (
    <div className="app-shell">
      <StatusBar theme="light" />

      {/* Header */}
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span
            style={{ fontSize: 13, color: '#7a9d8a', cursor: 'pointer' }}
            onClick={() => navigate('/report')}
          >‹ 健康報告</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1e3028' }}>InBody 體組成</div>
            <div style={{ fontSize: 11, color: '#7a9d8a', marginTop: 2 }}>最新測量：{latest.date}</div>
          </div>
          {/* 原始報告按鈕 */}
          <div style={{ fontSize: 11, color: '#5f846f', background: '#e2ede6', padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
            原始報告 ›
          </div>
        </div>
      </div>

      <div className="page">
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 切換列 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 2, background: '#deeae2', borderRadius: 9, padding: 2 }}>
              <div
                style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: mode === 'chart' ? '#fff' : 'transparent', color: mode === 'chart' ? '#5f846f' : '#aaa', boxShadow: mode === 'chart' ? '0 1px 3px rgba(0,0,0,.07)' : 'none', transition: 'all .18s' }}
                onClick={() => setMode('chart')}
              >折線圖</div>
              <div
                style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: mode === 'compare' ? '#fff' : 'transparent', color: mode === 'compare' ? '#5f846f' : '#aaa', boxShadow: mode === 'compare' ? '0 1px 3px rgba(0,0,0,.07)' : 'none', transition: 'all .18s' }}
                onClick={() => setMode('compare')}
              >與上次比</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 11, color: '#5f846f', border: '1px solid #deeae2', borderRadius: 8, padding: '4px 10px', background: '#fff', cursor: 'pointer' }}>
              全部歷史 ▾
            </div>
          </div>

          {/* ── 折線圖模式 ── */}
          {mode === 'chart' && (
            <>
              <MainMetricCard
                label="體重"
                value={latest.weight}
                unit="kg"
                delta={diff('weight')}
                chartData={INBODY_HISTORY.map(d => d.weight)}
                color="#7ac19a"
              />
              <MainMetricCard
                label="體脂率"
                value={latest.bodyFat}
                unit="%"
                delta={diff('bodyFat')}
                chartData={INBODY_HISTORY.map(d => d.bodyFat)}
                color="#9fcccc"
                rangeType="bodyFat"
                standard={GENDER === 'female' ? 'WHO 女性正常範圍 18–28%' : 'WHO 男性正常範圍 10–20%'}
              />
              <MainMetricCard
                label="骨骼肌重"
                value={latest.muscle}
                unit="kg"
                delta={diff('muscle')}
                chartData={INBODY_HISTORY.map(d => d.muscle)}
                color="#f2ac98"
              />
            </>
          )}

          {/* ── 與上次比模式 ── */}
          {mode === 'compare' && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
              <div style={{ padding: '10px 14px', background: '#f4f7f5', borderBottom: '1px solid #deeae2', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
                <span>上次 {prev.date}</span>
                <span>本次 {latest.date}</span>
              </div>
              {[
                { label: '體重', prev: prev.weight, curr: latest.weight, unit: 'kg', better: 'down' },
                { label: '體脂率', prev: prev.bodyFat, curr: latest.bodyFat, unit: '%', better: 'down' },
                { label: '骨骼肌重', prev: prev.muscle, curr: latest.muscle, unit: 'kg', better: 'up' },
              ].map((item, i) => {
                const delta = Math.round((item.curr - item.prev) * 10) / 10
                const improved = item.better === 'down' ? delta < 0 : delta > 0
                const dc = delta === 0 ? '#aaa' : improved ? '#5f846f' : '#c67566'
                const pct = Math.abs(Math.round((item.prev / (item.better === 'down' ? 100 : 50)) * 100))
                const cpct = Math.abs(Math.round((item.curr / (item.better === 'down' ? 100 : 50)) * 100))
                return (
                  <div key={i} style={{ padding: '12px 14px', borderBottom: i < 2 ? '1px solid #deeae2' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3028' }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: dc }}>{delta > 0 ? '+' : ''}{delta} {item.unit}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 5, background: '#faece8', borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
                          <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: '#f2ac98', borderRadius: 3 }} />
                        </div>
                        <div style={{ fontSize: 10, color: '#aaa', textAlign: 'right' }}>{item.prev} {item.unit}</div>
                      </div>
                      <span style={{ fontSize: 11, color: '#ccc' }}>→</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 5, background: '#e2ede6', borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
                          <div style={{ width: `${Math.min(cpct, 100)}%`, height: '100%', background: '#7ac19a', borderRadius: 3 }} />
                        </div>
                        <div style={{ fontSize: 10, color: '#1e3028', fontWeight: 700 }}>{item.curr} {item.unit}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── 次要指標 分隔線 ── */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onClick={() => setShowSecondary(!showSecondary)}
          >
            <div style={{ flex: 1, height: 1, background: '#deeae2' }} />
            <div style={{ fontSize: 11, color: '#7a9d8a', fontWeight: 700, padding: '2px 8px', border: '1px solid #deeae2', borderRadius: 8, background: '#fff' }}>
              {showSecondary ? '收起次要指標 ▲' : '更多指標 ▼'}
            </div>
            <div style={{ flex: 1, height: 1, background: '#deeae2' }} />
          </div>

          {/* ── 次要指標 ── */}
          {showSecondary && (
            <>
              {/* 體水分 */}
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3028', marginBottom: 10 }}>體水分</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {[
                    { label: '細胞內水', value: latest.water.in, unit: 'L', color: '#daedec' },
                    { label: '細胞外水', value: latest.water.out, unit: 'L', color: '#daedec' },
                    { label: '總體水分', value: latest.water.total, unit: 'L', color: '#9fcccc', highlight: true },
                  ].map((w, i) => (
                    <div key={i} style={{ background: w.color, borderRadius: 10, padding: '8px 6px', textAlign: 'center', border: w.highlight ? '1px solid rgba(102,136,142,.3)' : 'none' }}>
                      <div style={{ fontSize: 9, color: '#66888e', marginBottom: 3 }}>{w.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#1a2e38' }}>{w.value}<span style={{ fontSize: 9, fontWeight: 400, color: '#66888e' }}> {w.unit}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 蛋白質 + 礦物質 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: '蛋白質', value: latest.protein, unit: 'kg', delta: diff('protein'), color: '#e2ede6' },
                  { label: '礦物質', value: latest.mineral, unit: 'kg', delta: diff('mineral'), color: '#e2ede6' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 13, border: '1px solid #deeae2', padding: '11px 12px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#1e3028' }}>{item.value} <span style={{ fontSize: 10, fontWeight: 400, color: '#aaa' }}>{item.unit}</span></div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#5f846f', marginTop: 3 }}>↑ {item.delta} 正常</div>
                  </div>
                ))}
              </div>

              {/* BMI + 內臟脂肪 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#fff', borderRadius: 13, border: '1px solid #deeae2', padding: '11px 12px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>BMI</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#1e3028', marginBottom: 6 }}>{latest.bmi}</div>
                  <RangeBar value={latest.bmi} type="bmi" />
                  <div style={{ fontSize: 9, color: '#aaa', marginTop: 4 }}>WHO 正常 18.5–24.9</div>
                </div>
                <div style={{ background: '#fff', borderRadius: 13, border: '1px solid #deeae2', padding: '11px 12px', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>內臟脂肪</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#1e3028', marginBottom: 4 }}>Lv. <span style={{ color: '#5f846f' }}>{latest.visceral}</span></div>
                  <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 7, background: '#e2ede6', color: '#5f846f', marginBottom: 4 }}>正常 ✓</div>
                  <div style={{ fontSize: 9, color: '#aaa' }}>正常範圍 Lv.1–9</div>
                </div>
              </div>

              {/* 腰臀比 */}
              <div style={{ background: '#fff', borderRadius: 13, border: '1px solid #deeae2', padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3028' }}>腰臀比 WHR</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color: '#1e3028' }}>{latest.whr}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#5f846f' }}>正常 ✓</span>
                  </div>
                </div>
                <RangeBar value={latest.whr} type="whr" />
                <div style={{ fontSize: 10, color: '#aaa', marginTop: 5 }}>
                  {GENDER === 'female' ? 'WHO 女性正常範圍 < 0.80' : 'WHO 男性正常範圍 < 0.90'}
                </div>
              </div>
            </>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
