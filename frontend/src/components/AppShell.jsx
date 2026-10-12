const navigation = [
  ["dashboard", "/", "⌂", "Overview"],
  ["parking", "/parking", "▦", "Find parking"],
  ["booking", "/booking", "＋", "Book a space"],
  ["my-bookings", "/my-bookings", "▤", "My bookings"]
];

export function Brand({ light = false }) {
  return (
    <a className={`brand${light ? " brand-light" : ""}`} href="/">
      <span className="brand-mark">P</span>
      <span><strong>Parkside</strong><small>CAMPUS MOBILITY</small></span>
    </a>
  );
}

export default function AppShell({ breadcrumb, page, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-caption">WORKSPACE</span>
          {navigation.map(([key, href, symbol, label]) => (
            <a className={`nav-link${page === key ? " is-active" : ""}`} data-nav={key} href={href} key={key}>
              <span className="nav-symbol">{symbol}</span>{label}
            </a>
          ))}
          <span className="nav-caption nav-caption-lower">MANAGEMENT</span>
          <a className={`nav-link${page === "admin" ? " is-active" : ""}`} data-nav="admin" href="/admin">
            <span className="nav-symbol">◫</span>Admin dashboard
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-profile">
            <span className="profile-avatar" data-profile-initial>G</span>
            <span className="profile-copy"><strong data-profile-name>Guest</strong><small data-profile-role>Campus visitor</small></span>
          </div>
          <button className="text-button sign-out" data-logout type="button">Sign out</button>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">{breadcrumb}</div>
          <div className="topbar-actions">
            <span className="live-pill"><i /> Live availability</span>
            <a className="topbar-avatar" data-profile-initial href="/login" aria-label="Sign in">G</a>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
