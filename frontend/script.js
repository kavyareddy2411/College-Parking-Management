
const STORE = { users: "parkside.users", slots: "parkside.slots", bookings: "parkside.bookings", session: "parkside.session", selectedSlot: "parkside.selectedSlot" };
const zones = [
    { name: "North", location: "Library entrance", prefix: "N" },
    { name: "South", location: "Student centre", prefix: "S" },
    { name: "East", location: "Science block", prefix: "E" }
];

function readStore(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getUsers() { return readStore(STORE.users, []); }
function getSlots() { return readStore(STORE.slots, []); }
function getBookings() { return readStore(STORE.bookings, []); }
function setSlots(slots) { writeStore(STORE.slots, slots); }
function setBookings(bookings) { writeStore(STORE.bookings, bookings); }

function initialiseStore() {
    const users = getUsers();
    [
        { id: "demo-student", name: "Alex Morgan", email: "student@college.edu", password: "student123", role: "student", plate: "CAMPUS 01" },
        { id: "demo-admin", name: "Campus Admin", email: "admin@college.edu", password: "admin123", role: "admin", plate: "" }
    ].forEach((demo) => { if (!users.some((user) => user.email.toLowerCase() === demo.email)) users.push(demo); });
    writeStore(STORE.users, users);
    if (!localStorage.getItem(STORE.slots)) {
        writeStore(STORE.slots, zones.flatMap((zone) => Array.from({ length: 12 }, (_, index) => ({
            id: `${zone.prefix}-${String(index + 1).padStart(2, "0")}`, zone: zone.name, location: zone.location,
            status: [1, 5, 9].includes(index) ? "occupied" : "available"
        }))));
    }
    if (!localStorage.getItem(STORE.bookings)) setBookings([]);
}

function currentUser() { return getUsers().find((user) => user.id === localStorage.getItem(STORE.session)) || null; }
function activeBookings() { return getBookings().filter((booking) => booking.status === "active"); }
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function setMessage(element, message, kind = "error") {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message is-visible ${kind}`;
}
function setPageNote(message) {
    const note = document.getElementById("page-note");
    if (!note) return;
    note.textContent = message;
    note.className = "page-note is-visible success";
}
function formatDate(value, options = { weekday: "short", month: "short", day: "numeric" }) {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, options).format(date);
}

function initialiseNavigation() {
    const page = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => { if (link.dataset.nav === page) link.classList.add("is-active"); });
    document.querySelectorAll("[data-logout]").forEach((button) => button.addEventListener("click", () => {
        localStorage.removeItem(STORE.session);
        window.location.href = "index.html";
    }));
}
function initialiseProfile() {
    const user = currentUser();
    document.querySelectorAll("[data-profile-name]").forEach((item) => { item.textContent = user ? user.name : "Guest"; });
    document.querySelectorAll("[data-profile-role]").forEach((item) => { item.textContent = user ? (user.role === "admin" ? "Campus administrator" : user.role === "staff" ? "College staff" : "Student account") : "Campus visitor"; });
    document.querySelectorAll("[data-profile-initial]").forEach((item) => {
        item.textContent = user ? user.name.trim().charAt(0).toUpperCase() : "G";
        if (item.tagName === "A") item.href = user ? (user.role === "admin" ? "admin.html" : "my-bookings.html") : "login.html";
    });
    const accountLink = document.getElementById("account-link");
    if (accountLink && user) {
        accountLink.textContent = `Signed in as ${user.name} · Sign out`;
        accountLink.href = "#";
        accountLink.addEventListener("click", (event) => { event.preventDefault(); localStorage.removeItem(STORE.session); window.location.reload(); });
    }
}

function initialiseDashboard() {
    const slots = getSlots();
    const user = currentUser();
    const userBookings = user ? activeBookings().filter((booking) => booking.userId === user.id) : [];
    document.getElementById("dashboard-available").textContent = slots.filter((slot) => slot.status === "available").length;
    document.getElementById("dashboard-total").textContent = slots.length;
    document.getElementById("dashboard-bookings").textContent = userBookings.length;
    document.getElementById("dashboard-booking-foot").textContent = user ? "Spaces saved for your day" : "Sign in to see your reservations";
    const greeting = document.getElementById("greeting-name");
    if (user && greeting) greeting.textContent = user.name.split(" ")[0];
    const dateLabel = document.getElementById("today-label");
    if (dateLabel) dateLabel.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date()).toUpperCase();
    document.getElementById("dashboard-zones").innerHTML = zones.map((zone) => {
        const zoneSlots = slots.filter((slot) => slot.zone === zone.name);
        const open = zoneSlots.filter((slot) => slot.status === "available").length;
        const dots = zoneSlots.map((slot) => `<i class="map-dot ${escapeHTML(slot.status)}" title="${escapeHTML(slot.id)} · ${escapeHTML(slot.status)}"></i>`).join("");
        return `<div class="zone-row"><div class="zone-name"><span class="zone-marker">${zone.prefix}</span><span><strong>${zone.name} lot</strong><small>${zone.location}</small></span></div><div class="zone-dots" aria-label="${open} of ${zoneSlots.length} available">${dots}</div><div class="zone-count"><strong>${open}</strong><small>open</small></div></div>`;
    }).join("");
    const next = userBookings.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];
    const content = document.getElementById("next-booking-content");
    content.innerHTML = next
        ? `<div class="next-date"><strong>${escapeHTML(formatDate(next.date, { month: "short", day: "numeric" }))}</strong><span>${escapeHTML(next.time)}</span></div><div class="next-details"><span class="eyebrow">${escapeHTML(next.id)}</span><h3>${escapeHTML(next.slotId)} <span class="status-pill status-active">Confirmed</span></h3><p>${escapeHTML(next.zone)} lot · ${escapeHTML(next.duration)} hour${next.duration === 1 ? "" : "s"}</p></div><a class="text-link" href="my-bookings.html">Booking details <span>→</span></a>`
        : `<div class="empty-state compact-empty"><span class="empty-symbol">＋</span><strong>No upcoming bookings</strong><p>Save yourself the search and reserve a space.</p><a class="text-link" href="booking.html">Make a booking <span>→</span></a></div>`;
}

function initialiseParking() {
    const map = document.getElementById("lot-map");
    const filter = document.getElementById("zone-filter");
    const render = () => {
        const slots = getSlots();
        document.getElementById("available-count").textContent = slots.filter((slot) => slot.status === "available").length;
        map.innerHTML = zones.filter((zone) => filter.value === "all" || zone.name === filter.value).map((zone) => {
            const zoneSlots = slots.filter((slot) => slot.zone === zone.name);
            const open = zoneSlots.filter((slot) => slot.status === "available").length;
            const tiles = zoneSlots.map((slot) => `<button type="button" class="slot-tile slot-${escapeHTML(slot.status)}" data-slot-id="${escapeHTML(slot.id)}" ${slot.status !== "available" ? "disabled" : ""} aria-label="${escapeHTML(slot.id)}, ${escapeHTML(slot.status)}"><span class="slot-car">${slot.status === "available" ? "P" : "×"}</span><span>${escapeHTML(slot.id)}</span></button>`).join("");
            return `<section class="lot-zone"><div class="lot-zone-heading"><div><span class="zone-marker">${zone.prefix}</span><span><strong>${zone.name} lot</strong><small>${zone.location}</small></span></div><span class="lot-open-count">${open} open</span></div><div class="slot-grid">${tiles}</div></section>`;
        }).join("");
        map.querySelectorAll("[data-slot-id]").forEach((button) => button.addEventListener("click", () => {
            localStorage.setItem(STORE.selectedSlot, button.dataset.slotId);
            window.location.href = `booking.html?slot=${encodeURIComponent(button.dataset.slotId)}`;
        }));
    };
    filter.addEventListener("change", render);
    render();
}

function initialiseBookingForm() {
    const user = currentUser();
    if (!user) { window.location.href = "login.html?next=booking.html"; return; }
    const form = document.getElementById("booking-form");
    const dateField = document.getElementById("booking-date");
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateField.min = today;
    dateField.value = today;
    document.getElementById("booking-plate").value = user.plate || "";
    const requestedSlot = new URLSearchParams(window.location.search).get("slot") || localStorage.getItem(STORE.selectedSlot);
    const slotField = document.getElementById("booking-slot");
    const renderSlots = () => {
        const available = getSlots().filter((slot) => slot.status === "available");
        slotField.innerHTML = `<option value="">Choose an available space</option>${available.map((slot) => `<option value="${escapeHTML(slot.id)}">${escapeHTML(slot.id)} · ${escapeHTML(slot.zone)} lot</option>`).join("")}`;
        if (available.some((slot) => slot.id === requestedSlot)) slotField.value = requestedSlot;
    };
    renderSlots();
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const values = new FormData(form);
        const slot = getSlots().find((item) => item.id === values.get("slotId") && item.status === "available");
        const message = document.getElementById("form-message");
        if (!slot) { setMessage(message, "That space is no longer available. Please choose another one."); renderSlots(); return; }
        if (values.get("date") < today) { setMessage(message, "Choose today or a future date for your booking."); return; }
        const booking = {
            id: `PK-${Date.now().toString().slice(-7)}`, userId: user.id, userName: user.name,
            slotId: slot.id, zone: slot.zone, date: values.get("date"), time: values.get("time"),
            duration: Number(values.get("duration")), plate: String(values.get("plate")).trim().toUpperCase(),
            status: "active", createdAt: new Date().toISOString()
        };
        setBookings([...getBookings(), booking]);
        setSlots(getSlots().map((item) => item.id === slot.id ? { ...item, status: "reserved" } : item));
        localStorage.removeItem(STORE.selectedSlot);
        window.location.href = "my-bookings.html?created=1";
    });
}

function initialiseMyBookings() {
    const user = currentUser();
    if (!user) { window.location.href = "login.html?next=my-bookings.html"; return; }
    let filter = "upcoming";
    const list = document.getElementById("my-bookings-list");
    const render = () => {
        const bookings = getBookings().filter((booking) => booking.userId === user.id).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
        const upcoming = bookings.filter((booking) => booking.status === "active");
        document.getElementById("upcoming-count").textContent = upcoming.length;
        const shown = filter === "upcoming" ? upcoming : bookings.filter((booking) => booking.status !== "active");
        if (!shown.length) {
            list.innerHTML = `<div class="empty-state"><span class="empty-symbol">▤</span><h3>${filter === "upcoming" ? "No upcoming bookings" : "Nothing to see here yet"}</h3><p>${filter === "upcoming" ? "Find an open space and reserve it in a few quick steps." : "Cancelled bookings will show here."}</p><a class="button button-primary" href="${filter === "upcoming" ? "parking.html" : "booking.html"}">${filter === "upcoming" ? "Find a space" : "Book a space"} <span>→</span></a></div>`;
            return;
        }
        list.innerHTML = shown.map((booking) => {
            const date = formatDate(booking.date, { month: "short", day: "numeric" }).split(" ");
            const action = booking.status === "active" ? `<button type="button" class="button button-danger-quiet" data-cancel-booking="${escapeHTML(booking.id)}">Cancel booking</button>` : "";
            return `<article class="booking-card"><div class="booking-date-block"><strong>${escapeHTML(date[1])}</strong><span>${escapeHTML(date[0].toUpperCase())}</span></div><div class="booking-card-main"><div class="booking-card-title"><h3>${escapeHTML(booking.slotId)}</h3><span class="status-pill ${booking.status === "active" ? "status-active" : "status-cancelled"}">${booking.status === "active" ? "Confirmed" : "Cancelled"}</span></div><p>${escapeHTML(booking.zone)} lot · ${escapeHTML(booking.time)} · ${escapeHTML(booking.duration)} hour${booking.duration === 1 ? "" : "s"}</p><small>Booking ${escapeHTML(booking.id)} · Vehicle ${escapeHTML(booking.plate)}</small></div>${action}</article>`;
        }).join("");
        list.querySelectorAll("[data-cancel-booking]").forEach((button) => button.addEventListener("click", () => {
            const id = button.dataset.cancelBooking;
            const booking = getBookings().find((item) => item.id === id);
            setBookings(getBookings().map((item) => item.id === id ? { ...item, status: "cancelled" } : item));
            if (booking) setSlots(getSlots().map((slot) => slot.id === booking.slotId ? { ...slot, status: "available" } : slot));
            render(); setPageNote("Your booking has been cancelled. The space is available again.");
        }));
    };
    document.querySelectorAll("[data-booking-filter]").forEach((button) => button.addEventListener("click", () => {
        filter = button.dataset.bookingFilter;
        document.querySelectorAll("[data-booking-filter]").forEach((tab) => tab.classList.toggle("is-selected", tab === button));
        render();
    }));
    render();
    if (new URLSearchParams(window.location.search).has("created")) setPageNote("Booking confirmed. Your space is reserved.");
}

function initialiseAdmin() {
    const user = currentUser();
    if (!user || user.role !== "admin") { window.location.href = "login.html?next=admin.html"; return; }
    const render = () => {
        const slots = getSlots();
        const bookings = getBookings().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        document.getElementById("admin-total").textContent = slots.length;
        document.getElementById("admin-available").textContent = slots.filter((slot) => slot.status === "available").length;
        document.getElementById("admin-bookings").textContent = activeBookings().length;
        document.getElementById("admin-users").textContent = getUsers().length;
        const rows = document.getElementById("admin-booking-rows");
        if (!bookings.length) { rows.innerHTML = `<tr><td colspan="6"><div class="table-empty">No bookings yet. New campus reservations will appear here.</div></td></tr>`; return; }
        rows.innerHTML = bookings.map((booking) => {
            const email = getUsers().find((member) => member.id === booking.userId)?.email || "Campus member";
            const action = booking.status === "active" ? `<button type="button" class="table-action" data-admin-cancel="${escapeHTML(booking.id)}">Cancel</button>` : "";
            return `<tr><td><strong>${escapeHTML(booking.userName)}</strong><small>${escapeHTML(email)}</small></td><td><strong>${escapeHTML(booking.slotId)}</strong><small>${escapeHTML(booking.zone)} lot</small></td><td>${escapeHTML(formatDate(booking.date))}<small>${escapeHTML(booking.time)} · ${escapeHTML(booking.duration)}h</small></td><td>${escapeHTML(booking.plate)}</td><td><span class="status-pill ${booking.status === "active" ? "status-active" : "status-cancelled"}">${booking.status === "active" ? "Confirmed" : "Cancelled"}</span></td><td>${action}</td></tr>`;
        }).join("");
        rows.querySelectorAll("[data-admin-cancel]").forEach((button) => button.addEventListener("click", () => {
            const id = button.dataset.adminCancel;
            const target = getBookings().find((booking) => booking.id === id);
            setBookings(getBookings().map((booking) => booking.id === id ? { ...booking, status: "cancelled" } : booking));
            if (target) setSlots(getSlots().map((slot) => slot.id === target.slotId ? { ...slot, status: "available" } : slot));
            render(); setPageNote("Booking cancelled and space released.");
        }));
    };
    render();
}

function initialiseLogin() {
    document.getElementById("login-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const email = String(values.get("email")).trim().toLowerCase();
        const user = getUsers().find((item) => item.email.toLowerCase() === email && item.password === values.get("password"));
        if (!user) { setMessage(document.getElementById("form-message"), "That email and password do not match. Please try again."); return; }
        localStorage.setItem(STORE.session, user.id);
        const requested = new URLSearchParams(window.location.search).get("next");
        const allowed = ["index.html", "parking.html", "booking.html", "my-bookings.html", "admin.html"];
        window.location.href = allowed.includes(requested) ? requested : user.role === "admin" ? "admin.html" : "index.html";
    });
}
function initialiseRegistration() {
    document.getElementById("register-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const users = getUsers();
        const email = String(values.get("email")).trim().toLowerCase();
        if (users.some((user) => user.email.toLowerCase() === email)) { setMessage(document.getElementById("form-message"), "An account with that email already exists. Sign in instead."); return; }
        const user = { id: `user-${Date.now()}`, name: String(values.get("name")).trim(), email, password: String(values.get("password")), role: values.get("role"), plate: String(values.get("plate")).trim().toUpperCase() };
        users.push(user); writeStore(STORE.users, users); localStorage.setItem(STORE.session, user.id);
        window.location.href = "index.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initialiseStore();
    initialiseNavigation();
    initialiseProfile();
    const page = document.body.dataset.page;
    if (page === "dashboard") initialiseDashboard();
    if (page === "parking") initialiseParking();
    if (page === "booking") initialiseBookingForm();
    if (page === "my-bookings") initialiseMyBookings();
    if (page === "admin") initialiseAdmin();
    if (page === "login") initialiseLogin();
    if (page === "register") initialiseRegistration();
});
