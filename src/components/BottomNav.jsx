import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { path: '/report',   icon: '📊', label: '報告'  },
  { path: '/courses',  icon: '📅', label: '課程'  },
  { path: '/mascot',   icon: '🌿', label: '衡仔'  },
  { path: '/profile',  icon: '👤', label: '我的'  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="bottom-nav">
      {TABS.map(tab => (
        <div
          key={tab.path}
          className={`bn-item ${pathname.startsWith(tab.path) ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="bn-icon">{tab.icon}</span>
          <span className="bn-label">{tab.label}</span>
        </div>
      ))}
    </div>
  )
}
