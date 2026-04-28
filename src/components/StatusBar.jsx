export default function StatusBar({ theme = 'light' }) {
  const now = new Date()
  const time = now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false })
  return (
    <div className={`status-bar ${theme}`}>
      <span className={`sb-time ${theme}`}>{time}</span>
      <div className={`sb-icons ${theme}`}>
        <span>▲</span><span>5G</span><span>■</span>
      </div>
    </div>
  )
}
