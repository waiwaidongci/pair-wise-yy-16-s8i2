import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "首页", end: true },
  { to: "/work", label: "全部作品" },
  { to: "/about", label: "简介" },
  { to: "/contact", label: "约拍" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo" onClick={() => setMenuOpen(false)}>
          高原纪实<span className="site-logo-sub">Documentary Photography</span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link${isActive || (item.to === "/work" && location.pathname.startsWith("/work")) ? " is-active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="gold-rule" aria-hidden="true" />
    </header>
  );
}
