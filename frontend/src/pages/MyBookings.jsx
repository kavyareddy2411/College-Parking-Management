import AppShell from "../components/AppShell.jsx";

export default function MyBookings() {
  return (
    <AppShell page="my-bookings" breadcrumb={<>Workspace <span>/</span> My bookings</>}>
      <div className="page-content">
        <div className="page-heading heading-row"><div><p className="eyebrow">YOUR PARKING</p><h1>My bookings</h1><p className="muted">Your upcoming spaces, all in one place.</p></div><a className="button button-primary" href="/booking">New booking <span>→</span></a></div>
        <div className="tabs-row"><button className="tab-button is-selected" data-booking-filter="upcoming" type="button">Upcoming <span id="upcoming-count">0</span></button><button className="tab-button" data-booking-filter="past" type="button">Past &amp; cancelled</button></div>
        <section id="my-bookings-list" className="booking-list" aria-live="polite" />
        <div className="page-note" id="page-note" role="status" />
      </div>
    </AppShell>
  );
}
