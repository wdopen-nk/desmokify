# Desmokify

Desmokify is a full-stack mobile application designed to help users track and manage their journey toward quitting smoking. The application allows users to create a personalized quit plan, complete daily check-ins, and monitor meaningful progress statistics such as smoke-free days, streaks, cigarettes avoided, and money saved.

The project consists of a React Native mobile application built with Expo and a .NET backend API following a layered architecture.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Access and refresh token support
- Secure token storage using Expo SecureStore
- Protected API endpoints
- Persistent user sessions

### Quit Plan Management
Users can create and manage a personalized quit plan containing:

- Quit date
- Average cigarettes smoked per day
- Cigarettes per pack
- Price per pack

The quit plan can also be updated later to keep progress calculations accurate.

### Daily Check-Ins
Users can record their daily smoking progress by providing:

- Number of cigarettes smoked
- Optional personal note

The system allows one check-in per day and prevents duplicate submissions.

### Progress Statistics
Desmokify calculates several progress metrics based on the user's quit plan and daily check-ins:

- Days since quit
- Smoke-free days
- Current smoke-free streak
- Longest smoke-free streak
- Total check-ins
- Cigarettes avoided
- Money saved
- Average cigarettes smoked per day

### Mobile Application
The mobile application provides:

- Welcome screen
- Registration screen
- Login screen
- Quit plan creation and editing
- Dashboard overview
- Daily check-in screen
- Progress statistics
- Logout functionality

The interface uses a clean, modern dark theme designed around the Desmokify visual identity.

## Tech Stack

### Mobile
- React Native
- Expo SDK 54
- TypeScript
- React Navigation
- Expo SecureStore

### Backend
- ASP.NET Core
- C#
- Entity Framework Core
- PostgreSQL
- JWT Authentication

### Architecture
The backend follows a layered architecture:

- `Desmokify.Api` – API controllers and application configuration
- `Desmokify.Application` – DTOs, interfaces, and application contracts
- `Desmokify.Domain` – Core domain entities
- `Desmokify.Infrastructure` – Database access, Entity Framework Core, and service implementations

## Backend API

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/Auth/register` | Register a new user |
| POST | `/api/Auth/login` | Authenticate a user |
| GET | `/api/Auth/me` | Get the currently authenticated user |

### Quit Plans

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/QuitPlans` | Create a quit plan |
| GET | `/api/QuitPlans` | Get the user's quit plan |
| PUT | `/api/QuitPlans` | Update the user's quit plan |

### Daily Check-Ins

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/DailyCheckIns` | Create a daily check-in |
| GET | `/api/DailyCheckIns/today` | Get today's check-in |
| GET | `/api/DailyCheckIns/statistics` | Get progress statistics |

## Database

The application uses PostgreSQL with Entity Framework Core.

The main entities are:

- `User`
- `QuitPlan`
- `DailyCheckIn`

A unique database index ensures that each user can only create one daily check-in for a specific date.

## Running the Backend

Navigate to the backend directory and restore dependencies:

```bash
dotnet restore
```

Apply the database migrations:

```bash
dotnet ef database update \
    --project backend/Desmokify.Infrastructure \
    --startup-project backend/Desmokify.Api
```

Run the API:

```bash
dotnet run --project backend/Desmokify.Api
```

The API will then be available on the configured local development URL.

## Running the Mobile Application

Navigate to the mobile directory:

```bash
cd mobile
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

The application can then be opened using Expo Go on a physical device.

## API Configuration

The mobile application communicates with the backend through the API client located at:

```text
mobile/src/api/client.ts
```

The API base URL can be configured using:

```ts
const API_URL = "YOUR_BACKEND_URL";
```

During physical device development, a Cloudflare tunnel can be used to expose the local backend to the Expo application.

## Authentication Flow

1. A user registers or logs into the application.
2. The backend validates the credentials.
3. JWT access and refresh tokens are returned.
4. Tokens are securely stored using Expo SecureStore.
5. The access token is automatically attached to authenticated API requests.
6. The application restores the user session when it starts.
7. Protected backend endpoints validate the JWT before processing requests.

## Daily Check-In Flow

1. The user opens the daily check-in screen.
2. The user enters the number of cigarettes smoked.
3. An optional note can be added.
4. The request is sent to the authenticated API.
5. The backend validates the request.
6. The backend prevents duplicate check-ins for the same day.
7. The check-in is stored in the database.
8. Progress statistics are updated based on the recorded data.

## Statistics Calculation

The backend calculates progress using the user's quit plan and recorded daily check-ins.

Examples include:

**Days Since Quit**

Calculated from the configured quit date until the current date.

**Smoke-Free Days**

The number of check-ins where the user recorded zero cigarettes smoked.

**Current Streak**

The number of consecutive smoke-free days ending on the current day.

**Longest Streak**

The highest number of consecutive smoke-free days recorded by the user.

**Cigarettes Avoided**

Calculated by comparing the expected number of cigarettes based on the user's previous smoking habits with the cigarettes recorded in daily check-ins.

**Money Saved**

Calculated using the number of cigarettes avoided, cigarettes per pack, and pack price.

## Security

The application includes several security-related practices:

- JWT authentication
- Protected API endpoints
- Password hashing
- Secure token storage on mobile devices
- User-specific database queries
- Authorization checks before accessing personal data

## Current Status

The core functionality of the application is implemented:

- Authentication
- JWT authorization
- Secure token storage
- Quit plan management
- Daily check-ins
- Progress statistics
- PostgreSQL persistence
- Entity Framework Core migrations
- React Native mobile interface
- Expo physical device testing

## License

This project is currently intended for educational and portfolio purposes.
