# Invoice MVP - Billing Service Mock

A full‑stack invoice application with NestJS backend, Vue frontend, PostgreSQL, RabbitMQ, and Docker Compose.

## 🚀 Overview

This project mocks a billing service for invoice management, providing:
- REST API and event‑driven workflows via RabbitMQ
- SPA frontend built with Vue (Vite)
- Local development environment via Docker Compose (PostgreSQL + RabbitMQ)

Architectural flow:
- `frontend` → talks to `backend` via HTTP
- `backend` persists data in `postgres` and publishes events to `rabbitmq`
- `nginx` reverse‑proxies `/api` to the backend and serves the frontend on `/`

---

## ⚙️ Tech Stack

- **Backend**: NestJS (Node.js + TypeScript)
- **Frontend**: Vue 3 SPA built with Vite
- **Database**: PostgreSQL 15
- **Message Broker**: RabbitMQ 3.13‑management
- **Infrastructure**: Docker + Docker Compose

---

## 📦 Services

- `billing-service-mock-backend`: NestJS invoice API
- `billing-service-mock-frontend`: Vue SPA
- `billing-service-mock-nginx`: Reverse proxy for `/api` (backend) and `/` (frontend)
- `billing-service-mock-postgres`: PostgreSQL database
- `billing-service-mock-rabbitmq`: Message broker (RabbitMQ with management UI)

---

## 🔧 Prerequisites

- Docker
- Docker Compose
- Node.js >= 18 (only for local dev, not required for Dockerized build)

---

## ▶️ Getting Started

### 1. Build and start the stack

```bash
cd /home/garieta/billing-service-mock

docker-compose build --no-cache
docker-compose up -d
```

Services will be available on:
- `http://localhost` → Vue frontend (via nginx)
- `http://localhost:3000` → Backend (NestJS, if needed for direct testing)
- `http://localhost:15672` → RabbitMQ management UI

---

### 2. Stopping and cleaning (optional)

```bash
docker-compose down
docker-compose down --volumes --remove-orphans
docker system prune -a --volumes
```

---

## 🌐 Routing (via nginx)

- `/api/*` → proxied to `backend`
- any other `/` route → served by Vue SPA (frontend)

Configuration is in `nginx/nginx.conf` (reverse proxy + SPA fallback).

---

## 🧪 Notes for Development

- Prisma schema is in `backend/prisma/schema.prisma`.
- Frontend assets are in `frontend/src`; build output is `frontend/dist`.

---

## 📄 License

This project is for demo purposes. If you are going to fork it, please message me :)