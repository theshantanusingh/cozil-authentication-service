# 🛡️ Cozil Auth Service

Welcome to the **Authentication Service** of the Cozil project — a modular, production-ready microservice designed with industry best practices. This project is part of a broader **distributed, microservices-based architecture** intended for deep learning in full-stack development, authentication strategies, DevOps, and secure deployments.

---

## 🌟 Project Vision

* **Microservice Architecture**: Each service in the Cozil ecosystem is independently containerized, communicates via HTTP (or eventually async queues), and is designed for high cohesion and low coupling.
* **Real-World Security**: This auth service supports **access tokens and refresh tokens**, securely stored in MongoDB. Advanced practices like **token rotation** and **Redis-based session blacklisting** will be integrated shortly.
* **Reverse Proxy (Nginx)**: The full system will be served behind a single **Nginx gateway**, enabling request routing, rate limiting, SSL termination, and logging.
* **Docker Ready**: All services, including the frontend (already complete), will be containerized for local dev, CI/CD, and cloud deployment.

> 🔒 **Note**: While some advanced security features like token rotation are postponed for now, this service already enforces strong password rules, hashed storage, and automatic token cleanup via MongoDB TTL indexes.

---

## 🚀 Installation (via GitHub)

### 1. Clone the Repository

```bash
git clone https://github.com/theshantanusingh/cozil-authentication-service
cd authentication
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root with the following keys:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

### 4. Run the Server

```bash
npm run dev
```

---

## 🧰 Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT (access + refresh tokens), bcrypt
* **Logging**: Pino + Pino Pretty
* **Containerization**: Docker (planned)
* **Proxy Layer**: Nginx (planned)
* **Architecture**: Distributed microservices

---

## 🔍 API Endpoints

### POST `/auth/signup`

* Register a new user
* Validates username & password

### POST `/auth/login`

* Logs in a user
* Returns access and refresh tokens

### POST `/auth/logout`

* Invalidates a refresh token

More routes will be added as security features grow (rotation, multi-device session management).

---

## 📊 Folder Structure

```
cozil-auth-service/
├── config/             # Configuration settings (e.g., JWT, DB)
├── controllers/        # Auth logic (login, logout, signup)
├── middlewares/        # (Planned) validation and auth middleware
├── models/             # Mongoose models (User, Token)
├── routes/             # Express routes
├── utils/              # Logging, token creation, password validation
├── .env                # Environment variables
├── server.js           # Entry point
└── package.json
```

---

## 🚧 Planned Features

* [ ] Token rotation
* [ ] Redis session store for refresh tokens
* [ ] Admin service with permission-based access
* [ ] Email/OTP-based password recovery
* [ ] Dockerfile + docker-compose
* [ ] Centralized error handling and validation middleware
* [ ] OpenAPI documentation

---

## 🐳 Docker Support

This authentication service comes with a production-ready `Dockerfile` to build and run the app inside a containerized environment.

### 🔨 Build the Docker Image

Build the image and tag it as `cozil-auth-service`:

```bash
docker build -t cozil-auth-service .

Start the authentication service container using the following command:

```bash
docker run --env-file .env -p 8080:8080 --name authncozil cozil-auth-service


## 🌊 Final Notes

This service is a foundational piece of a large-scale project meant for mastering secure full-stack architecture. Despite being a learning project, it follows many best practices of production systems.

> Contributions, feedback, and suggestions are always welcome as this system evolves!
