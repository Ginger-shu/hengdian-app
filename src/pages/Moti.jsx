import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const HISTORY = [
  { date: '2024/11/10', risk: 31, attention: [{ name: '圓肩', value: '20°' }, { name: '腰椎前凸', value: '45°' }, { name: '脊椎側彎', value: '12°' }], maintain: ['骨盆傾斜', '頸椎對位'] },
  { date: '2025/01/15', risk: 28, attention: [{ name: '圓肩', value: '18°' }, { name: '腰椎前凸', value: '43°' }, { name: '脊椎側彎', value: '11°' }], maintain: ['骨盆傾斜', '頸椎對位', '肩膀高低'] },
  { date: '2025/03/20', risk: 25, attention: [{ name: '圓肩', value: '17°' }, { name: '腰椎前凸', value: '41°' }], maintain: ['骨盆傾斜', '頸椎對位', '肩膀高低', '脊椎側彎'] },
  { date: '2025/06/05', risk: 23, attention: [{ name: '圓肩', value: '15°' }, { name: '腰椎前凸', value: '40°' }, { name: '脊椎側彎', value: '9°' }], maintain: ['骨盆傾斜', '頸椎對位', '肩膀高低'] },
]

const RISK_GRADE = (r) => r <= 20 ? { label: '優秀', color: '#5f846f', bg: '#e2ede6' } : r <= 30 ? { label: '良好', color: '#ba9e60', bg: '#fcf4e3' } : r <= 50 ? { label: '需注意', color: '#c67566', bg: '#faece8' } : { label: '高風險', color: '#c67566', bg: '#faece8' }

export default function Moti() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(HISTORY.length - 1)
  const [showMaintain, setShowMaintain] = useState(false)
  const current = HISTORY[selected]
  const prev = selected > 0 ? HISTORY[selected - 1] : null
  const grade = RISK_GRADE(current.risk)
  const riskDelta = prev ? current.risk - prev.risk : 0

  return (
    <div className="app-shell">
      <StatusBar theme="light" />
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: '#7a9d8a', cursor: 'pointer' }} onClick={() => navigate('/report')}>‹ 健康報告</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#1e3028', marginBottom: 2 }}>MOTI 姿勢評估</div>
        <div style={{ fontSize: 11, color: '#7a9d8a' }}>最新評估：{current.date}</div>
      </div>

      <div className="page">
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 歷次縮圖切換 */}
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
            {HISTORY.map((h, i) => (
              <div key={i} onClick={() => setSelected(i)}
                style={{ flexShrink: 0, width: 64, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 64, height: 80, borderRadius: 10, background: i === selected ? '#daedec' : '#f4f7f5', border: `2px solid ${i === selected ? '#9fcccc' : '#deeae2'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, transition: 'all .15s' }}>🦴</div>
                <div style={{ fontSize: 9, color: i === selected ? '#5f846f' : '#aaa', fontWeight: i === selected ? 700 : 400, textAlign: 'center' }}>{h.date.slice(5)}</div>
              </div>
            ))}
          </div>

          {/* 骨架圖主圖 */}
          <div style={{ background: '#daedec', borderRadius: 14, height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid rgba(102,136,142,.2)', cursor: 'pointer' }}>
            <div style={{ fontSize: 48 }}>🦴</div>
            <div style={{ fontSize: 11, color: '#66888e', fontWeight: 700 }}>點擊放大 · 含第 2 頁</div>
          </div>

          {/* 風險指數 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3 }}>風險指數</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#1e3028', lineHeight: 1, marginBottom: 5 }}>{current.risk}</div>
              <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 9, background: grade.bg, color: grade.color }}>{grade.label}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 6, background: '#f4f7f5', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
                <div style={{ width: `${current.risk}%`, height: '100%', background: `linear-gradient(90deg, #7ac19a, ${current.risk > 30 ? '#f2ac98' : '#9fcccc'})`, borderRadius: 3, transition: 'width .5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#aaa', marginBottom: 8 }}>
                <span style={{ color: '#5f846f', fontWeight: 700 }}>0 優秀</span>
                <span>50</span>
                <span style={{ color: '#c67566' }}>100 高風險</span>
              </div>
              {prev && (
                <div style={{ fontSize: 11, color: riskDelta < 0 ? '#5f846f' : '#c67566', fontWeight: 700 }}>
                  {riskDelta < 0 ? '↓ 改善' : '↑ 上升'} {Math.abs(riskDelta)} 分（較上次）
                </div>
              )}
            </div>
          </div>

          {/* 需關注項目 */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ padding: '10px 14px', background: '#fcf4e3', borderBottom: '1px solid #eae0c0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13 }}>⚠️</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3028' }}>需關注項目</span>
              <span style={{ fontSize: 11, color: '#ba9e60', marginLeft: 'auto' }}>{current.attention.length} 項</span>
            </div>
            {current.attention.map((item, i) => {
              const prevRecord = prev?.attention.find(a => a.name === item.name)
              const prevVal = prevRecord ? parseFloat(prevRecord.value) : null
              const currVal = parseFloat(item.value)
              const improved = prevVal && currVal < prevVal
              return (
                <div key={i} style={{ padding: '11px 14px', borderBottom: i < current.attention.length - 1 ? '1px solid #deeae2' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3028', marginBottom: 2 }}>{item.name}</div>
                    {prevVal && (
                      <div style={{ fontSize: 10, color: improved ? '#5f846f' : '#c67566', fontWeight: 700 }}>
                        {prevVal}° → {currVal}° {improved ? '↓ 改善中' : '↑ 注意'}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#ba9e60' }}>{item.value}</div>
                </div>
              )
            })}
          </div>

          {/* 維持良好項目（折疊） */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #deeae2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
            <div style={{ padding: '10px 14px', background: '#e2ede6', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => setShowMaintain(!showMaintain)}>
              <span style={{ fontSize: 13 }}>✅</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1e3028' }}>維持良好</span>
              <span style={{ fontSize: 11, color: '#5f846f', marginLeft: 'auto' }}>{current.maintain.length} 項 {showMaintain ? '▲' : '▼'}</span>
            </div>
            {showMaintain && (
              <div style={{ padding: '10px 14px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {current.maintain.map((m, i) => (
                  <div key={i} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: '#e2ede6', color: '#5f846f' }}>{m} ✓</div>
                ))}
              </div>
            )}
          </div>

          {/* 待確認提示 */}
          <div style={{ background: '#fcf4e3', borderRadius: 12, border: '1px solid #eae0c0', padding: '10px 13px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 13, flexShrink: 0 }}>💬</span>
            <div style={{ fontSize: 11, color: '#ba9e60', lineHeight: 1.6 }}>此層設計仍有部分待確認（改善建議文案、歷史趨勢圖），確認後再補入。</div>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
