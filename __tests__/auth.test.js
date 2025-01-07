import mongoose from "mongoose";
import request from "supertest";

import app from "../index.js";
import User from "../models/user.model.js";

describe("Authentication Endpoints", () => {
	beforeEach(async () => {
		await User.deleteMany({});
	});

	describe("POST /api/v1/signup", () => {
		it("should create first user as admin", async () => {
			const res = await request(app).post("/api/v1/signup").send({
				email: "admin@example.com",
				password: "password123",
			});

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("User created successfully.");

			const user = await User.findOne({ email: "admin@example.com" });
			expect(user.role).toBe("admin");
		});

		it("should return 409 if email exists", async () => {
			await User.create({
				email: "test@example.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app).post("/api/v1/signup").send({
				email: "test@example.com",
				password: "password123",
			});

			expect(res.status).toBe(409);
			expect(res.body.message).toBe("Email already exists.");
		});
	});

	describe("POST /api/v1/login", () => {
		it("should login user and return token", async () => {
			await User.create({
				email: "user@example.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app).post("/api/v1/login").send({
				email: "user@example.com",
				password: "password123",
			});

			expect(res.status).toBe(200);
			expect(res.body.data.token).toBeDefined();
		});

		it("should return 404 for invalid credentials", async () => {
			const res = await request(app).post("/api/v1/login").send({
				email: "invalid@example.com",
				password: "wrongpassword",
			});

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("User not found.");
		});
	});

	describe("GET /api/v1/logout", () => {
		it("should logout user", async () => {
			const user = await User.create({
				email: "user2@example.com",
				password: "password123",
				role: "viewer",
			});
			const userToken = (
				await request(app).post("/api/v1/login").send({
					email: "user2@example.com",
					password: "password123",
				})
			).body.data.token;

			const res = await request(app).get("/api/v1/logout").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.message).toBe("User logged out successfully.");
		});

		it("should return 401 if not authenticated", async () => {
			const res = await request(app).get("/api/v1/logout");

			expect(res.status).toBe(401);
		});
	});

	afterAll(async () => {
		await User.deleteMany({});
		await mongoose.connection.close();
		await app.closeServer();
	});
});
