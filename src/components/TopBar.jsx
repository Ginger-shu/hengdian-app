// 白底 Top Bar（首頁、報告列表用）
export default function TopBar({ points = 1240 }) {
  return (
    <div className="top-bar">
      <div className="top-bar-logo">衡點<em>健康</em></div>
      <div className="top-bar-right">
        <div className="pts-badge">✦ {points.toLocaleString()} 點</div>
        <div className="notif-btn">🔔<div className="notif-dot"/></div>
      </div>
    </div>
  )
}
