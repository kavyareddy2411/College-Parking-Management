import AppShell from "../components/AppShell.jsx";

export default function Admin() {
  return (
    <AppShell page="admin" breadcrumb={<>Management <span>/</span> Admin dashboard</>}>
      <div className="page-content">
        <div className="page-heading heading-row"><div><p className="eyebrow">CAMPUS OPERATIONS</p><h1>Admin dashboard</h1><p className="muted">A live view of your campus parking activity.</p></div><span className="admin-tag">ADMIN VIEW</span></div>
        <section className="stats-grid stats-grid-admin">
          <article className="stat-card"><span className="stat-label">Total spaces</span><strong className="stat-value" id="admin-total">—</strong><span className="stat-foot">Across all campus lots</span><span className="stat-mark stat-mark-green">▦</span></article>
          <article className="stat-card"><span className="stat-label">Available now</span><strong className="stat-value" id="admin-available">—</strong><span className="stat-foot">Ready to be booked</span><span className="stat-mark stat-mark-blue">✓</span></article>
          <article className="stat-card"><span className="stat-label">Active bookings</span><strong className="stat-value" id="admin-bookings">—</strong><span className="stat-foot">Upcoming reservations</span><span className="stat-mark stat-mark-orange">↗</span></article>
          <article className="stat-card"><span className="stat-label">Registered users</span><strong className="stat-value" id="admin-users">—</strong><span className="stat-foot">Campus members</span><span className="stat-mark stat-mark-yellow">◎</span></article>
        </section>
        <section className="panel admin-table-panel"><div className="section-heading"><div><h2>Recent bookings</h2><p className="muted">Review and manage campus reservations.</p></div><span className="admin-tag">ALL USERS</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Member</th><th>Space</th><th>Arrival</th><th>Vehicle</th><th>Status</th><th /></tr></thead><tbody id="admin-booking-rows" /></table></div></section>
        <div className="page-note" id="page-note" role="status" />
      </div>
    </AppShell>
  );
}
