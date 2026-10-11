# College Parking Management System

## Run the frontend

1. Open the `frontend` folder in VS Code.
2. Open `frontend/index.html` in a browser. You can also use the VS Code Live Server extension and choose **Open with Live Server**.
3. Select **Find parking** to see the 36 example spaces across North, South, and East lots.
4. Sign in or create an account to make a booking. Your bookings appear under **My bookings**, where you can cancel them.
5. Sign in as the administrator to review all bookings in **Admin dashboard**.

Demo sign-ins:

- Student: `student@college.edu` / `student123`
- Admin: `admin@college.edu` / `admin123`

## Current project behavior

The frontend is a standalone demonstration. Accounts, reservations, and slot availability are stored in this browser's local storage, so they persist on this browser but are not shared with other devices. Do not enter real passwords or personal information. The Spring Boot files in `backend` are still a starter project and are not connected to these pages.
