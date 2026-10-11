# College Parking Management System

## Run locally

The frontend uses the Spring Boot API, so open it through the running server rather than opening `frontend/index.html` directly.

1. Start MySQL and create a database named `parkingdb`.
2. Check `backend/src/main/resources/application.properties` and set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in your environment if your local MySQL settings differ from the defaults.
3. From the project root, start the backend:

	```powershell
	mvn -f backend/pom.xml spring-boot:run
	```

4. Open [http://localhost:8080](http://localhost:8080). Spring Boot serves both the frontend pages and the API.

The app creates 36 example parking spaces and the two demo accounts on its first start. Bookings, users, and slot status are stored in MySQL.

Demo sign-ins (change these before any public deployment):

- Student: `student@college.edu` / `student123`
- Admin: `admin@college.edu` / `admin123`

## Run with Docker

1. Install and start Docker Desktop.
2. From the project root, create your local environment file in PowerShell:

	```powershell
	Copy-Item .env.example .env
	```

3. Edit `.env` and replace the example MySQL and demo-account passwords with strong values.
4. Build and start the web app and MySQL database:

	```powershell
	docker compose up --build -d
	```

5. Open `http://localhost:<APP_PORT>` (the example uses port `8080`). If that port is busy, change `APP_PORT` in `.env`, for example to `8082`. To view startup logs, run `docker compose logs -f app`. Stop the containers with `docker compose down`; the database remains in its named volume. To also delete the database contents, run `docker compose down -v`.

The root `Dockerfile` packages the Spring Boot app and frontend files in one image. Docker Compose runs MySQL alongside it and keeps database files in a named volume. Keep `.env` private. This is a student project and should receive a production security review before public deployment.
