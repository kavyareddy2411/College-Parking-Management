import AppShell from "../components/AppShell.jsx";

export default function Parking() {
  return (
    <AppShell page="parking" breadcrumb={<>Campus <span>/</span> Parking availability</>}>
      <div className="page-content">
        <div className="page-heading heading-row"><div><p className="eyebrow">THE CAMPUS LOT</p><h1>Find your space</h1><p className="muted">Choose an available spot to start your booking.</p></div><a className="button button-primary" href="/booking">Book a space <span>→</span></a></div>
        <section className="availability-strip" aria-label="Parking summary"><div><span className="summary-value" id="available-count">—</span><span className="summary-label">available now</span></div><div className="summary-divider" /><div><i className="legend-dot legend-free" /><span className="summary-label">Available</span></div><div><i className="legend-dot legend-occupied" /><span className="summary-label">Occupied</span></div><div><i className="legend-dot legend-reserved" /><span className="summary-label">Reserved</span></div><span className="summary-updated">Updated just now</span></section>
        <section className="lot-section"><div className="section-heading"><div><h2>Parking map</h2><p className="muted">Select any open space to reserve it.</p></div><label className="filter-label">Zone<select id="zone-filter"><option value="all">All zones</option><option value="North">North lot</option><option value="South">South lot</option><option value="East">East lot</option></select></label></div><div className="lot-map" id="lot-map" aria-live="polite" /><div className="map-footnote"><span className="map-pin">N</span> North lot · Library <span className="map-separator">/</span> South lot · Student centre <span className="map-separator">/</span> East lot · Science block</div></section>
        <div className="page-note" id="page-note" role="status" />
      </div>
    </AppShell>
  );
}
