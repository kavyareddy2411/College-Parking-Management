import AppShell from "../components/AppShell.jsx";

export default function Dashboard() {
  return (
    <AppShell page="dashboard" breadcrumb={<>Campus <span>/</span> Overview</>}>
      <div className="page-content">
        <div className="page-heading heading-row">
          <div><p className="eyebrow" id="today-label">CAMPUS PARKING</p><h1>Good day<span className="heading-comma">,</span> <span id="greeting-name">there</span>.</h1><p className="muted">Here’s what’s happening across campus today.</p></div>
          <a className="button button-primary" href="/booking">Book a space <span>→</span></a>
        </div>
        <section className="stats-grid" aria-label="Parking summary">
          <article className="stat-card"><span className="stat-label">Spaces available</span><strong className="stat-value" id="dashboard-available">—</strong><span className="stat-foot"><span className="trend-up">●</span> Ready to reserve now</span><span className="stat-mark stat-mark-green">▦</span></article>
          <article className="stat-card"><span className="stat-label">Campus capacity</span><strong className="stat-value" id="dashboard-total">—</strong><span className="stat-foot">Across 3 parking zones</span><span className="stat-mark stat-mark-blue">⌖</span></article>
          <article className="stat-card stat-card-accent"><span className="stat-label">Your upcoming bookings</span><strong className="stat-value" id="dashboard-bookings">0</strong><span className="stat-foot" id="dashboard-booking-foot">Spaces saved for your day</span><span className="stat-mark stat-mark-orange">↗</span></article>
        </section>
        <div className="dashboard-grid">
          <section className="panel lot-preview-panel"><div className="section-heading"><div><p className="eyebrow">LIVE CAMPUS MAP</p><h2>Parking at a glance</h2></div><a className="text-link" href="/parking">View all spaces <span>→</span></a></div><div className="zone-list" id="dashboard-zones" /><div className="map-legend"><span><i className="legend-dot legend-free" />Available</span><span><i className="legend-dot legend-occupied" />Occupied</span><span><i className="legend-dot legend-reserved" />Reserved</span></div></section>
          <section className="panel next-booking-panel"><div className="section-heading"><div><p className="eyebrow">YOUR DAY</p><h2>Next booking</h2></div><span className="small-icon">↗</span></div><div id="next-booking-content" className="next-booking-content" /></section>
        </div>
        <section className="quick-actions"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Get where you’re going.</h2><p className="muted">Reserve a space ahead of time or check what’s open right now.</p></div><div className="quick-action-buttons"><a className="button button-dark" href="/parking">Explore parking <span>→</span></a><a className="button button-outline" href="/my-bookings">My bookings</a></div></section>
        <footer className="dashboard-footer"><span>Parkside · College Parking Management</span><a href="/login" id="account-link">Sign in to your account</a></footer>
      </div>
    </AppShell>
  );
}
