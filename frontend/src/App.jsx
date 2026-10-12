import { useEffect } from "react";
import { initialisePage } from "../script.js";
import Admin from "./pages/Admin.jsx";
import Booking from "./pages/Booking.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Parking from "./pages/Parking.jsx";
import Register from "./pages/Register.jsx";

const pages = {
  "/": ["dashboard", Dashboard],
  "/login": ["login", Login],
  "/register": ["register", Register],
  "/booking": ["booking", Booking],
  "/parking": ["parking", Parking],
  "/my-bookings": ["my-bookings", MyBookings],
  "/admin": ["admin", Admin]
};

export default function App() {
  const [page, Page] = pages[window.location.pathname] ?? pages["/"];

  useEffect(() => {
    document.body.dataset.page = page;
    document.body.classList.toggle("auth-page", page === "login" || page === "register");
    initialisePage(page);
  }, [page]);

  return <Page />;
}
