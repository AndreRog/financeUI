import { useNavigate } from 'react-router'
import { Icon } from '@/components/Icon'
import { useThemeMode } from '@/theme/ThemeModeProvider'

export function GuestTopBar() {
  const { mode, toggle } = useThemeMode()
  const navigate = useNavigate()
  return (
    <header className="gl-top">
      <div className="gl-brand">
        <span className="gl-brand-mark">
          <Icon name="trending-up" size={16} strokeWidth={2.4} />
        </span>
        <span className="gl-brand-name">MoneyMind</span>
      </div>
      <div className="gl-top-actions">
        <button className="gl-login" onClick={() => navigate('/login')}>
          Log in
        </button>
        <button
          className="gl-toggle"
          onClick={toggle}
          aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <Icon name={mode === 'dark' ? 'sun' : 'moon'} size={18} />
        </button>
      </div>
    </header>
  )
}
