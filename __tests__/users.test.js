import mongoose from "mongoose";
import request from "supertest";

import app from "../index.js";
import User from "../models/user.model.js";

describe("User Management Endpoints", () => {
	let adminToken;
	let editorToken;
	let viewerToken;

	beforeAll(async () => {
		await User.deleteMany({});

		const admin = await User.create({
			email: "admin@test.com",
			password: "password123",
			role: "admin",
		});
		adminToken = (
			await request(app).post("/api/v1/login").send({
				email: "admin@test.com",
				password: "password123",
			})
		).body.data.token;

		const editor = await User.create({
			email: "editor@test.com",
			password: "password123",
			role: "editor",
		});
		editorToken = (
			await request(app).post("/api/v1/login").send({
				email: "editor@test.com",
				password: "password123",
			})
		).body.data.token;

		const viewer = await User.create({
			email: "viewer@test.com",
			password: "password123",
			role: "viewer",
		});
		viewerToken = (
			await request(app).post("/api/v1/login").send({
				email: "viewer@test.com",
				password: "password123",
			})
		).body.data.token;
	});

	describe("GET /users", () => {
		it("should allow admin to get all users", async () => {
			const res = await request(app).get("/api/v1/users/").set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data.length).toBe(3);
			expect(res.body.message).toBe("Users fetched successfully.");
		});

		it("should support pagination", async () => {
			const res = await request(app)
				.get("/api/v1/users?limit=2&offset=1")
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data.length).toBe(2);
			expect(res.body.message).toBe("Users fetched successfully.");
		});
	});

	describe("POST /users", () => {
		it("should allow admin to add new user", async () => {
			const res = await request(app)
				.post("/api/v1/users/add-user")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					email: "newuser1@test.com",
					password: "password123",
					role: "viewer",
				});

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("User created successfully.");
		});

		it("should not allow editor to add new user", async () => {
			const res = await request(app)
				.post("/api/v1/users/add-user")
				.set("Authorization", `Bearer ${editorToken}`)
				.send({
					email: "newuser2@test.com",
					password: "password123",
					role: "viewer",
				});

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});

		it("should not allow viewer to add new user", async () => {
			const res = await request(app)
				.post("/api/v1/users/add-user")
				.set("Authorization", `Bearer ${viewerToken}`)
				.send({
					email: "newuser3@test.com",
					password: "password123",
					role: "viewer",
				});

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});
	});

	describe("PUT /users/update-password/:id", () => {
		it("should allow user to update user", async () => {
			const user = await User.create({
				email: "newuser4@test.com",
				password: "password123",
				role: "viewer",
			});
			const userToken = (
				await request(app).post("/api/v1/login").send({
					email: "newuser4@test.com",
					password: "password123",
				})
			).body.data.token;

			const res = await request(app)
				.put(`/api/v1/users/update-password/${user.id}`)
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					old_password: "password123",
					new_password: "newpassword123",
				});

			expect(res.status).toBe(204);
		});

		it("should not allow admin to update user", async () => {
			const user = await User.create({
				email: "newuser5@test.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app)
				.put(`/api/v1/users/update-password/${user.id}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					old_password: "password123",
					new_password: "newpassword123",
				});

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});

		it("should not allow editor to update user", async () => {
			const user = await User.create({
				email: "newuser6@test.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app)
				.put(`/api/v1/users/update-password/${user.id}`)
				.set("Authorization", `Bearer ${editorToken}`)
				.send({
					old_password: "password123",
					new_password: "newpassword123",
				});

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});

		it("should not allow viewer to update user", async () => {
			const user = await User.create({
				email: "newuser7@test.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app)
				.put(`/api/v1/users/update-password/${user.id}`)
				.set("Authorization", `Bearer ${viewerToken}`)
				.send({
					old_password: "password123",
					new_password: "newpassword123",
				});

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});
	});

	describe("DELETE /users/:id", () => {
		it("should allow admin to delete user", async () => {
			const user = await User.create({
				email: "newuser8@test.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app)
				.delete(`/api/v1/users/${user.id}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(await User.findById(user.id)).toBeNull();
			expect(res.body.message).toBe("User deleted successfully.");
		});

		it("should not allow editor to delete user", async () => {
			const user = await User.create({
				email: "newuser9@test.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app)
				.delete(`/api/v1/users/${user.id}`)
				.set("Authorization", `Bearer ${editorToken}`);

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});

		it("should not allow viewer to delete user", async () => {
			const user = await User.create({
				email: "newuser0@test.com",
				password: "password123",
				role: "viewer",
			});

			const res = await request(app)
				.delete(`/api/v1/users/${user.id}`)
				.set("Authorization", `Bearer ${viewerToken}`);

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});
	});

	afterAll(async () => {
		await User.deleteMany({});
		await mongoose.connection.close();
		await app.closeServer();
	});
});
