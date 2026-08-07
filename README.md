# Cringe Jar Backend API

A lightweight, high-performance NestJS RESTful API designed to track "cringe" moments, tallies, and history logs among group members in real time. Built with TypeScript, TypeORM, and PostgreSQL, fully containerized using Docker Compose for rapid local development.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** NestJS (Node.js & TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Validation:** `class-validator`, `class-transformer`
- **Containerization:** Docker & Docker Compose
- **Architecture Pattern:** Encapsulated Repository Pattern (Clean Architecture separating Domain, Services, Repositories, and Controllers)

---

## 🚀 Features

- **Room Management:** Create room instances secured by custom passcodes and unique 6-character short IDs.
- **Member Roster:** Dynamically register members into active room scorecards.
- **Tally Tracking:** Log infractions/tallies against specific room members with customized descriptions.
- **Audit History Log:** Persist detailed event logs with relation tracking per room.
- **Hot-Reload Development:** Containerized environment pre-configured with volume mounts and NestJS watch mode for instant compile updates.

---

## 📂 Project Structure

```
src/
├── application/
│   ├── dtos/
│   │   ├── add.member.to.room.dto.ts
│   │   ├── add.tally.dto.ts
│   │   └── create.room.dto.ts
│   └── services/
│       └── rooms.service.ts
├── domain/
│   └── entities/
│       ├── room.entity.ts
│       └── tally.log.entity.ts
└── infrastructure/
    ├── controllers/
    │   └── rooms.controller.ts
    └── database/
        └── repositories/
            ├── room.repository.ts
            └── tally.repository.ts
```

---

## ⚡ Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your machine.

### Quick Start with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cringe-jar-backend
   ```

2. **Spin up containers:**
   ```bash
   docker compose up --build
   ```
   *The NestJS application will be accessible at `http://localhost:3000` and automatically recompile when changes are saved locally.*

3. **Reset DB Volumes (Optional):**
   If you change entity schemas or column constraints during development, reset the local Postgres volume with:
   ```bash
   docker compose down -v
   docker compose up --build
   ```

---

## 📡 API Endpoints & Usage

All endpoints require room passcode verification via the `x-passcode` request header where applicable.

### 1. Create Room
* **`POST /rooms`**
* **Headers:** `Content-Type: application/json`
* **Body:**
  ```json
  {
    "name": "Living Room Jar",
    "passcode": "1234"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "id": "OOPZRN",
    "name": "Living Room Jar",
    "passcode": "1234",
    "scores": {},
    "createdAt": "2026-08-07T08:55:18.036Z"
  }
  ```

---

### 2. Fetch Room Details
* **`GET /rooms/:id`**
* **Headers:**
  * `x-passcode`: `1234`
* **Response (200 OK):**
  ```json
  {
    "id": "OOPZRN",
    "name": "Living Room Jar",
    "passcode": "1234",
    "scores": {
      "Alice": 1
    },
    "history": [
      {
        "id": "f678f1ec-eee4-4118-bf6b-7f0308476cc7",
        "targetName": "Alice",
        "description": "Said 'synergy' unironically in a meeting",
        "timestamp": "2026-08-07T09:05:26.093Z"
      }
    ],
    "createdAt": "2026-08-07T08:55:18.036Z"
  }
  ```

---

### 3. Add Member to Room
* **`POST /rooms/:id/members`**
* **Headers:**
  * `Content-Type: application/json`
  * `x-passcode`: `1234`
* **Body:**
  ```json
  {
    "member": "Alice"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "id": "OOPZRN",
    "name": "Living Room Jar",
    "passcode": "1234",
    "scores": {
      "Alice": 0
    }
  }
  ```

---

### 4. Log a Tally
* **`POST /rooms/:id/tally`**
* **Headers:**
  * `Content-Type: application/json`
  * `x-passcode`: `1234`
* **Body:**
  ```json
  {
    "targetName": "Alice",
    "description": "Said 'synergy' unironically in a meeting"
  }
  ```
* **Response (201 Created):** Returns the updated room object complete with recalculated score and prepended history log.
