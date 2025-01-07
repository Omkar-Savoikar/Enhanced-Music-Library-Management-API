import mongoose from "mongoose";
import request from "supertest";

import app from "../index.js";
import Artist from "../models/artist.model.js";
import Favorite from "../models/favorite.model.js";
import User from "../models/user.model.js";

describe("Favorite Entity", () => {
	let user;
	let userToken;
	let adminToken;

	beforeAll(async () => {
		await User.deleteMany({});

		user = await User.create({
			email: "newuser@test.com",
			password: "password123",
			role: "editor",
		});
		userToken = (
			await request(app).post("/api/v1/login").send({
				email: "newuser@test.com",
				password: "password123",
			})
		).body.data.token;

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
	});

	describe("GET /favorites/artist", () => {
		it("should return all favorites of the user", async () => {
			const item = await Artist.create({ name: "Artist1", grammy: 0 });
			await Favorite.create({
				user_id: user._id,
				category: "artist",
				item_id: item._id,
				name: item.name,
			});
			const res = await request(app).get("/api/v1/favorites/artist").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
			expect(res.body.message).toBe("Favorites retrieved successfully.");
		});

		it("should return 401 if user is not logged in", async () => {
			const res = await request(app).get("/api/v1/favorites");

			expect(res.status).toBe(401);
			expect(res.body.message).toBe("Unauthorized Access");
		});
	});

	describe("POST /favorites/add-favorite", () => {
		it("should add new favorite", async () => {
			const artist = await Artist.create({ name: "Artist1", grammy: 0 });
			const res = await request(app)
				.post("/api/v1/favorites/add-favorite")
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					category: "artist",
					item_id: artist.id,
				});

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("Favorite added successfully.");
		});

		it("should return 400 if category is invalid", async () => {
			const res = await request(app)
				.post("/api/v1/favorites/add-favorite")
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					category: "invalid",
					item_id: "123",
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});

		it("should return 400 if item_id is invalid", async () => {
			const res = await request(app)
				.post("/api/v1/favorites/add-favorite")
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					category: "artist",
					item_id: "123",
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});

		it("should return 401 if user is not logged in", async () => {
			const res = await request(app).post("/api/v1/favorites/add-favorite").send({
				category: "artist",
				item_id: "123",
			});

			expect(res.status).toBe(401);
			expect(res.body.message).toBe("Unauthorized Access");
		});
	});

	describe("DELETE /favorites/remove-favorite/:id", () => {
		it("should remove favorite", async () => {
			const artist = await Artist.create({ name: "Artist1", grammy: 0 });
			const favorite = await Favorite.create({
				user_id: user.id,
				category: "artist",
				item_id: artist.id,
				name: artist.name,
			});

			const res = await request(app)
				.delete(`/api/v1/favorites/remove-favorite/${favorite.id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Favorite removed successfully.");
		});

		it("should return 401 if user is not logged in", async () => {
			const res = await request(app).delete("/api/v1/favorites/remove-favorite/123");

			expect(res.status).toBe(401);
			expect(res.body.message).toBe("Unauthorized Access");
		});

		it("should return 403 if user is not the owner of the favorite", async () => {
			const artist = await Artist.create({ name: "Artist1", grammy: 0 });
			const favorite = await Favorite.create({
				user_id: user.id,
				category: "artist",
				item_id: artist.id,
				name: artist.name,
			});

			const res = await request(app)
				.delete(`/api/v1/favorites/remove-favorite/${favorite.id}`)
				.set("Authorization", `Bearer ${adminToken}`);

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
