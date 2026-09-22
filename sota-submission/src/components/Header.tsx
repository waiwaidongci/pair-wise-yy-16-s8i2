import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  isActive: (pathname: string) => boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '首页', isActive: p => p === '/' },
  { to: '/work', label: '全部作品', isActive: p => p === '/work' },
  { to: '/work/highland-pastoral', label: '系列长页', isActive: p => p.startsWith('/work/') },
  { to: '/about', label: '简介', isActive: p => p === '/about' },
  { to: '/contact', label: '约拍', isActive: p => p === '/contact' },
]

export function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // 路由变化时收起移动端菜单
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="林牧 · 高原纪实摄影">
          林牧
        </Link>
        <nav className="nav-desktop" aria-label="主导航">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={item.isActive(pathname) ? 'active' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="menu"
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {menuOpen && (
        <nav className="nav-mobile" aria-label="移动端导航">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={item.isActive(pathname) ? 'active' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
