# ADHD Helper

A lightweight web app for ADHD check-ins, task management, and a reward/lottery system.

## Features
- Daily check-in questions
- Task tracking
- Reward pool and lottery
- Simple web UI

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Spring Boot, MyBatis
- Database: MySQL

## Project Structure
- `index.html`, `tasks.html`, `lottery.html`, etc.: Frontend pages
- `assets/`: Images
- `backend/`: Spring Boot API

## Quick Start
1. Create database tables
   - Use `backend/db/schema.sql`
2. Configure database credentials
   - Copy `backend/src/main/resources/application.example.yml` to `backend/src/main/resources/application.yml`
   - Set `spring.datasource.username` and `spring.datasource.password`
   - Or set environment variables `DB_USERNAME` and `DB_PASSWORD`
3. Start the backend
   - Run `mvn spring-boot:run` inside `backend/`
   - API base: `http://localhost:8081/api`
4. Open the frontend
   - Open `index.html` in a browser
   - Or serve the root directory with any static file server

## Notes
- `backend/src/main/resources/application.yml` is ignored by git to avoid committing secrets.
