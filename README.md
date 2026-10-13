# College Parking Management System

## Run locally

The React frontend uses the Spring Boot API, so open it through the running server rather than opening source files directly.

1. Start MySQL and create a database named `parkingdb`.
2. Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` in your environment if your local MySQL settings differ from the defaults in `backend/src/main/resources/application.properties`. Keep real database credentials and deployment passwords out of tracked files.
3. Build the React frontend (Node.js and npm are required):

	```powershell
	cd frontend
	npm install
	npm run build
	cd ..
	```

4. From the project root, start the backend:

	```powershell
	mvn -f backend/pom.xml spring-boot:run
	```

5. Open [http://localhost:8081](http://localhost:8081). Spring Boot serves the built React app and API on port `8081` by default. To use a different port, set `SERVER_PORT` in your environment before starting the backend.

For frontend development, run `npm run dev` from `frontend`; the Vite server proxies API requests to the Spring Boot server on port `8081`.

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
4. Build and start the web app and MySQL database with the root `Dockerfile`:

	```powershell
	docker compose up --build -d
	```

5. Open `http://localhost:<APP_PORT>` (the example uses port `8080`). If that port is busy, change `APP_PORT` in `.env`, for example to `8082`. To view startup logs, run `docker compose logs -f app`. Stop the containers with `docker compose down`; the database remains in its named volume. To also delete the database contents, run `docker compose down -v`.

The root `Dockerfile` packages the Spring Boot app and frontend files in one image. Docker Compose runs MySQL alongside it and keeps database files in a named volume. Keep `.env` private. This is a student project and should receive a production security review before public deployment.

To build the app image without Compose, run `docker build -t college-parking-management .` from the project root. The container listens on port `8080`; provide the database connection and credentials with environment variables when running it. For a complete deployment including MySQL, use Docker Compose as shown above.
