import AppShell from "../components/AppShell.jsx";

export default function Booking() {
  return (
    <AppShell page="booking" breadcrumb={<>Workspace <span>/</span> Book a space</>}>
      <div className="page-content narrow-content">
        <div className="page-heading"><p className="eyebrow">RESERVE YOUR SPOT</p><h1>Book a parking space</h1><p className="muted">Tell us when you’re arriving and we’ll hold your space.</p></div>
        <div className="booking-layout">
          <section className="panel booking-panel">
            <form id="booking-form" className="form-stack">
              <label>Parking space<select id="booking-slot" name="slotId" required><option value="">Choose an available space</option></select><small className="field-hint"><a href="/parking">View the parking map</a> to check spaces first.</small></label>
              <div className="form-row"><label>Arrival date<input type="date" name="date" id="booking-date" required /></label><label>Arrival time<input type="time" name="time" defaultValue="09:00" required /></label></div>
              <label>Parking duration<select name="duration" required><option value="1">1 hour</option><option value="2">2 hours</option><option value="3">3 hours</option><option value="4">4 hours</option><option value="8">Full day (8 hours)</option></select></label>
              <label>Vehicle registration<input type="text" name="plate" id="booking-plate" placeholder="e.g. ABC 1234" maxLength={12} required /></label>
              <div className="booking-summary"><span className="summary-icon">✓</span><span><strong>Free campus parking</strong><small>No payment required for campus members.</small></span></div>
              <p className="form-message" id="form-message" role="status" />
              <button type="submit" className="button button-primary button-wide">Confirm booking <span>→</span></button>
            </form>
          </section>
          <aside className="booking-aside"><div className="aside-number">01 <span>/ 03</span></div><h3>One less thing to plan.</h3><p>Your space is held for 15 minutes after your arrival time. If plans change, cancel your booking from My bookings.</p><a href="/my-bookings" className="text-link">View my bookings <span>→</span></a></aside>
        </div>
      </div>
    </AppShell>
  );
}
