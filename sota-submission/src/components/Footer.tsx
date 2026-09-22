import { Link } from 'react-router-dom'
import { NAV_ITEMS } from './Header'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-brand">林牧 · 高原纪实摄影</p>
        <nav className="footer-nav" aria-label="页脚导航">
          {NAV_ITEMS.map(item => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="footer-note">
          所有照片均拍摄于青藏高原及周边地区，版权归摄影师所有。© 2026
        </p>
      </div>
    </footer>
  )
}
