
const zones = [
    { name: "North", location: "Library entrance", prefix: "N" },
    { name: "South", location: "Student centre", prefix: "S" },
    { name: "East", location: "Science block", prefix: "E" }
];

async function api(path, options = {}) {
    const headers = { ...options.headers };
    if (options.body) headers["Content-Type"] = "application/json";
    let response;
    try {
        response = await fetch(path, { credentials: "same-origin", ...options, headers });
    } catch {
        throw new Error("Cannot connect to the parking server. Make sure the Spring Boot app is running.");
    }
    if (response.status === 204) return null;
    const result = await response.json().catch(() => null);
    if (!response.ok) {
        const messages = {
            400: "Please check the information you entered and try again.",
            401: "Email or password is incorrect. Please try again.",
            403: "You do not have permission to do that.",
            404: "The requested item could not be found.",
            409: "That item has changed. Refresh the page and try again."
        };
        const endpointMessages = {
            "/api/auth/register": { 409: "An account with that email already exists. Sign in instead." },
            "/api/bookings": { 409: "That parking space is no longer available. Choose another space." }
        };
        const error = new Error(result?.detail || result?.message || endpointMessages[path]?.[response.status] || messages[response.status] || "The server could not complete your request. Try again shortly.");
        error.status = response.status;
        throw error;
    }
    return result;
}

function currentUser() { return api("/api/auth/me"); }
function getSlots() { return api("/api/slots"); }
function getMyBookings() { return api("/api/bookings/mine"); }
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
function showPageError(message) {
    let note = document.getElementById("page-note");
    if (!note) {
        note = document.createElement("div");
        note.id = "page-note";
        note.className = "page-note";
        note.setAttribute("role", "alert");
        document.querySelector(".page-content")?.prepend(note);
    }
    note.textContent = message;
    note.className = "page-note is-visible error";
}
function formatDate(value, options = { weekday: "short", month: "short", day: "numeric" }) {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, options).format(date);
}

function initialiseNavigation() {
    const page = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => { if (link.dataset.nav === page) link.classList.add("is-active"); });
    document.querySelectorAll("[data-logout]").forEach((button) => button.addEventListener("click", async () => {
        try { await api("/api/auth/logout", { method: "POST" }); } finally { window.location.href = "/"; }
    }));
}
function initialiseProfile(user) {
    document.querySelectorAll("[data-profile-name]").forEach((item) => { item.textContent = user ? user.name : "Guest"; });
    document.querySelectorAll("[data-profile-role]").forEach((item) => { item.textContent = user ? (user.role === "admin" ? "Campus administrator" : user.role === "staff" ? "College staff" : "Student account") : "Campus visitor"; });
    document.querySelectorAll("[data-profile-initial]").forEach((item) => {
        item.textContent = user ? user.name.trim().charAt(0).toUpperCase() : "G";
        if (item.tagName === "A") item.href = user ? (user.role === "admin" ? "/admin" : "/my-bookings") : "/login";
    });
    const accountLink = document.getElementById("account-link");
    if (accountLink && user) {
        accountLink.textContent = `Signed in as ${user.name} · Sign out`;
        accountLink.href = "#";
        accountLink.addEventListener("click", async (event) => {
            event.preventDefault();
            try { await api("/api/auth/logout", { method: "POST" }); } finally { window.location.reload(); }
        });
    }
}

async function initialiseDashboard(user) {
    const slots = await getSlots();
    const userBookings = user ? (await getMyBookings()).filter((booking) => booking.status === "active") : [];
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
        ? `<div class="next-date"><strong>${escapeHTML(formatDate(next.date, { month: "short", day: "numeric" }))}</strong><span>${escapeHTML(next.time)}</span></div><div class="next-details"><span class="eyebrow">${escapeHTML(next.id)}</span><h3>${escapeHTML(next.slotId)} <span class="status-pill status-active">Confirmed</span></h3><p>${escapeHTML(next.zone)} lot · ${escapeHTML(next.duration)} hour${next.duration === 1 ? "" : "s"}</p></div><a class="text-link" href="/my-bookings">Booking details <span>→</span></a>`
        : `<div class="empty-state compact-empty"><span class="empty-symbol">＋</span><strong>No upcoming bookings</strong><p>Save yourself the search and reserve a space.</p><a class="text-link" href="/booking">Make a booking <span>→</span></a></div>`;
}

async function initialiseParking() {
    const map = document.getElementById("lot-map");
    const filter = document.getElementById("zone-filter");
    let slots = await getSlots();
    const render = () => {
        document.getElementById("available-count").textContent = slots.filter((slot) => slot.status === "available").length;
        map.innerHTML = zones.filter((zone) => filter.value === "all" || zone.name === filter.value).map((zone) => {
            const zoneSlots = slots.filter((slot) => slot.zone === zone.name);
            const open = zoneSlots.filter((slot) => slot.status === "available").length;
            const tiles = zoneSlots.map((slot) => `<button type="button" class="slot-tile slot-${escapeHTML(slot.status)}" data-slot-id="${escapeHTML(slot.id)}" ${slot.status !== "available" ? "disabled" : ""} aria-label="${escapeHTML(slot.id)}, ${escapeHTML(slot.status)}"><span class="slot-car">${slot.status === "available" ? "P" : "×"}</span><span>${escapeHTML(slot.id)}</span></button>`).join("");
            return `<section class="lot-zone"><div class="lot-zone-heading"><div><span class="zone-marker">${zone.prefix}</span><span><strong>${zone.name} lot</strong><small>${zone.location}</small></span></div><span class="lot-open-count">${open} open</span></div><div class="slot-grid">${tiles}</div></section>`;
        }).join("");
        map.querySelectorAll("[data-slot-id]").forEach((button) => button.addEventListener("click", () => {
            window.location.href = `/booking?slot=${encodeURIComponent(button.dataset.slotId)}`;
        }));
    };
    filter.addEventListener("change", render);
    render();
}

async function initialiseBookingForm(user) {
    if (!user) { window.location.href = "/login?next=%2Fbooking"; return; }
    const form = document.getElementById("booking-form");
    const dateField = document.getElementById("booking-date");
    const now = new Date();
    const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateField.min = today;
    dateField.value = today;
    document.getElementById("booking-plate").value = user.plate || "";
    const requestedSlot = new URLSearchParams(window.location.search).get("slot");
    const slotField = document.getElementById("booking-slot");
    const renderSlots = async () => {
        const available = (await getSlots()).filter((slot) => slot.status === "available");
        slotField.innerHTML = `<option value="">Choose an available space</option>${available.map((slot) => `<option value="${escapeHTML(slot.id)}">${escapeHTML(slot.id)} · ${escapeHTML(slot.zone)} lot</option>`).join("")}`;
        if (available.some((slot) => slot.id === requestedSlot)) slotField.value = requestedSlot;
    };
    await renderSlots();
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const values = new FormData(form);
        const message = document.getElementById("form-message");
        try {
            await api("/api/bookings", { method: "POST", body: JSON.stringify({
                slotId: values.get("slotId"), date: values.get("date"), time: values.get("time"),
                duration: Number(values.get("duration")), plate: String(values.get("plate")).trim().toUpperCase()
            }) });
            window.location.href = "/my-bookings?created=1";
        } catch (error) {
            setMessage(message, error.message);
            if (error.status === 409) await renderSlots();
        }
    });
}

async function initialiseMyBookings(user) {
    if (!user) { window.location.href = "/login?next=%2Fmy-bookings"; return; }
    let filter = "upcoming";
    const list = document.getElementById("my-bookings-list");
    let bookings = await getMyBookings();
    const render = () => {
        const upcoming = bookings.filter((booking) => booking.status === "active");
        document.getElementById("upcoming-count").textContent = upcoming.length;
        const shown = filter === "upcoming" ? upcoming : bookings.filter((booking) => booking.status !== "active");
        if (!shown.length) {
            list.innerHTML = `<div class="empty-state"><span class="empty-symbol">▤</span><h3>${filter === "upcoming" ? "No upcoming bookings" : "Nothing to see here yet"}</h3><p>${filter === "upcoming" ? "Find an open space and reserve it in a few quick steps." : "Cancelled bookings will show here."}</p><a class="button button-primary" href="${filter === "upcoming" ? "/parking" : "/booking"}">${filter === "upcoming" ? "Find a space" : "Book a space"} <span>→</span></a></div>`;
            return;
        }
        list.innerHTML = shown.map((booking) => {
            const date = formatDate(booking.date, { month: "short", day: "numeric" }).split(" ");
            const action = booking.status === "active" ? `<button type="button" class="button button-danger-quiet" data-cancel-booking="${escapeHTML(booking.id)}">Cancel booking</button>` : "";
            return `<article class="booking-card"><div class="booking-date-block"><strong>${escapeHTML(date[1])}</strong><span>${escapeHTML(date[0].toUpperCase())}</span></div><div class="booking-card-main"><div class="booking-card-title"><h3>${escapeHTML(booking.slotId)}</h3><span class="status-pill ${booking.status === "active" ? "status-active" : "status-cancelled"}">${booking.status === "active" ? "Confirmed" : "Cancelled"}</span></div><p>${escapeHTML(booking.zone)} lot · ${escapeHTML(booking.time)} · ${escapeHTML(booking.duration)} hour${booking.duration === 1 ? "" : "s"}</p><small>Booking ${escapeHTML(booking.id)} · Vehicle ${escapeHTML(booking.plate)}</small></div>${action}</article>`;
        }).join("");
        list.querySelectorAll("[data-cancel-booking]").forEach((button) => button.addEventListener("click", async () => {
            const id = button.dataset.cancelBooking;
            try {
                await api(`/api/bookings/${encodeURIComponent(id.replace(/^PK-/, ""))}`, { method: "DELETE" });
                bookings = await getMyBookings();
                render();
                setPageNote("Your booking has been cancelled. The space is available again.");
            } catch (error) { showPageError(error.message); }
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

async function initialiseAdmin(user) {
    if (!user || user.role !== "admin") { window.location.href = "/login?next=%2Fadmin"; return; }
    const render = async () => {
        const [summary, bookings] = await Promise.all([api("/api/admin/summary"), api("/api/admin/bookings")]);
        document.getElementById("admin-total").textContent = summary.totalSpaces;
        document.getElementById("admin-available").textContent = summary.availableSpaces;
        document.getElementById("admin-bookings").textContent = summary.activeBookings;
        document.getElementById("admin-users").textContent = summary.registeredUsers;
        const rows = document.getElementById("admin-booking-rows");
        if (!bookings.length) { rows.innerHTML = `<tr><td colspan="6"><div class="table-empty">No bookings yet. New campus reservations will appear here.</div></td></tr>`; return; }
        rows.innerHTML = bookings.map((booking) => {
            const action = booking.status === "active" ? `<button type="button" class="table-action" data-admin-cancel="${escapeHTML(booking.id)}">Cancel</button>` : "";
            return `<tr><td><strong>${escapeHTML(booking.userName)}</strong><small>${escapeHTML(booking.email)}</small></td><td><strong>${escapeHTML(booking.slotId)}</strong><small>${escapeHTML(booking.zone)} lot</small></td><td>${escapeHTML(formatDate(booking.date))}<small>${escapeHTML(booking.time)} · ${escapeHTML(booking.duration)}h</small></td><td>${escapeHTML(booking.plate)}</td><td><span class="status-pill ${booking.status === "active" ? "status-active" : "status-cancelled"}">${booking.status === "active" ? "Confirmed" : "Cancelled"}</span></td><td>${action}</td></tr>`;
        }).join("");
        rows.querySelectorAll("[data-admin-cancel]").forEach((button) => button.addEventListener("click", async () => {
            const id = button.dataset.adminCancel;
            try {
                await api(`/api/admin/bookings/${encodeURIComponent(id.replace(/^PK-/, ""))}`, { method: "DELETE" });
                await render();
                setPageNote("Booking cancelled and space released.");
            } catch (error) { showPageError(error.message); }
        }));
    };
    await render();
}

function initialiseLogin() {
    document.getElementById("login-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        try {
            const user = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: values.get("email"), password: values.get("password") }) });
            const requested = new URLSearchParams(window.location.search).get("next");
            const allowed = ["/", "/parking", "/booking", "/my-bookings", "/admin"];
            window.location.href = allowed.includes(requested) ? requested : user.role === "admin" ? "/admin" : "/";
        } catch (error) { setMessage(document.getElementById("form-message"), error.message); }
    });
}
function initialiseRegistration() {
    document.getElementById("register-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const message = document.getElementById("form-message");
        try {
            await api("/api/auth/register", { method: "POST", body: JSON.stringify({
                name: values.get("name"), email: values.get("email"), password: values.get("password"),
                role: values.get("role"), plate: values.get("plate")
            }) });
            window.location.href = "/";
        } catch (error) { setMessage(message, error.message); }
    });
}

export async function initialisePage(page) {
    initialiseNavigation();
    if (page === "login") { initialiseLogin(); return; }
    if (page === "register") { initialiseRegistration(); return; }
    try {
        const user = await currentUser();
        initialiseProfile(user);
        if (page === "dashboard") await initialiseDashboard(user);
        if (page === "parking") await initialiseParking();
        if (page === "booking") await initialiseBookingForm(user);
        if (page === "my-bookings") await initialiseMyBookings(user);
        if (page === "admin") await initialiseAdmin(user);
    } catch (error) { showPageError(error.message || "Could not connect to the parking server. Open this page from the running application."); }
}
