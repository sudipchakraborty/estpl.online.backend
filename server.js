require("dotenv").config();

const http = require("node:http");
const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");

const dashboardRoutes = require("./dashboard/dashboardRoutes");
const contactRoutes = require("./modules/contact/contactRoutes");
const forgotPasswordRoutes = require("./modules/forgotPassword/forgotPasswordRoutes");
const inspectionRoutes = require("./modules/inspection/inspectionRoutes");
const signinRoutes = require("./modules/signin/signinRoutes");
const signupRoutes = require("./modules/signup/signupRoutes");
const userSessionRoutes = require("./modules/userSession/userSessionRoutes");
const whatsappRoutes = require("./modules/whatsapp/whatsappRoutes");
const initializeSocket = require("./sockets/socketManager");

const app = express();
const server = http.createServer(app);
const port = Number(process.env.PORT) || 3000;
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "estpl-online-backend" });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/signin", signinRoutes);
app.use("/api/auth/login", signinRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/auth/register", signupRoutes);
app.use("/api/forgot-password", forgotPasswordRoutes);
app.use("/api/sessions", userSessionRoutes);
app.use("/api/whatsapp", whatsappRoutes);

app.use((request, response) => {
  response.status(404).json({ error: `Route not found: ${request.method} ${request.path}` });
});

app.use((error, _request, response, _next) => {
  console.error("[HTTP]", error);
  response.status(error.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
  });
});

const io = new Server(server, {
  cors: { origin: allowedOrigin, credentials: true },
});
initializeSocket(io);

server.listen(port, () => {
  console.log(`[SERVER] Listening on http://localhost:${port}`);
  console.log(`[SERVER] Health check: http://localhost:${port}/health`);
});

function shutdown(signal) {
  console.log(`[SERVER] ${signal} received; shutting down`);
  io.close(() => server.close(() => process.exit(0)));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = { app, server };
