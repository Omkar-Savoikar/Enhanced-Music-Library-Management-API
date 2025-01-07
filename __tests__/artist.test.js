import mongoose from "mongoose";
import request from "supertest";

import app from "../index.js";
import Artist from "../models/artist.model.js";
import User from "../models/user.model.js";

describe("Artist Entity", () => {
	let userToken;

	beforeAll(async () => {
		await User.deleteMany({});

		const user = await User.create({
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
	});

	describe("GET /artists", () => {
		let artist;

		beforeAll(async () => {
			await Artist.deleteMany({});

			artist = await Artist.create({ name: "Artist1", grammy: 0 });
		});

		it("should return all artists", async () => {
			const res = await request(app).get("/api/v1/artists").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
			expect(res.body.message).toBe("Artists retrieved successfully.");
		});

		it("should return artists with specified limit and offset", async () => {
			await Artist.create({ name: "Artist2", grammy: 1, hidden: true });
			await Artist.create({ name: "Artist3", grammy: 2, hidden: true });
			const res = await request(app)
				.get("/api/v1/artists?limit=2&offset=0")
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(2);
			expect(res.body.message).toBe("Artists retrieved successfully.");
		});

		it("should return artists with specified grammy", async () => {
			const res = await request(app)
				.get(`/api/v1/artists?grammy=${artist.grammy}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
			expect(res.body.message).toBe("Artists retrieved successfully.");
		});

		it("should return artists with specified hidden", async () => {
			const res = await request(app)
				.get(`/api/v1/artists?hidden=${artist.hidden}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(1);
			expect(res.body.message).toBe("Artists retrieved successfully.");
		});
	});

	describe("GET /artists/:id", () => {
		it("should return artist by id", async () => {
			const artist = await Artist.create({ name: "Artist1", grammy: 0 });

			const res = await request(app)
				.get(`/api/v1/artists/${artist.id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data.artist_id).toBe(artist.id);
			expect(res.body.data.name).toBe("Artist1");
			expect(res.body.data.grammy).toBe(0);
			expect(res.body.message).toBe("Artist retrieved successfully.");
		});

		it("should return 404 if artist is not found", async () => {
			const res = await request(app).get("/api/v1/artists/123").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Artist not found");
		});
	});

	describe("POST /artists", () => {
		beforeEach(async () => {
			await Artist.deleteMany({});
		});

		it("should create new artist", async () => {
			const res = await request(app)
				.post("/api/v1/artists/add-artist")
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					name: "Artist2",
					grammy: 0,
				});

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("Artist created successfully.");
		});

		it("should return 400 if artist name is empty", async () => {
			const res = await request(app)
				.post("/api/v1/artists/add-artist")
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					name: "",
					grammy: 0,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});

		it("should return 400 if artist grammy is negative", async () => {
			const res = await request(app)
				.post("/api/v1/artists/add-artist")
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					name: "Artist2",
					grammy: -1,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});

		it("should return 401 if not authenticated", async () => {
			const res = await request(app).post("/api/v1/artists/add-artist").send({
				name: "Artist2",
				grammy: 0,
			});

			expect(res.status).toBe(401);
			expect(res.body.message).toBe("Unauthorized Access");
		});

		it("should return 403 if user is not editor or admin", async () => {
			const viewer = await User.create({
				email: "viewer@test.com",
				password: "password123",
				role: "viewer",
			});
			const viewerToken = (
				await request(app).post("/api/v1/login").send({
					email: "viewer@test.com",
					password: "password123",
				})
			).body.data.token;

			const res = await request(app)
				.post("/api/v1/artists/add-artist")
				.set("Authorization", `Bearer ${viewerToken}`)
				.send({
					name: "Artist2",
					grammy: 0,
				});

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});
	});

	describe("PUT /artists/:id", () => {
		let artist;

		beforeEach(async () => {
			await Artist.deleteMany({});

			artist = await Artist.create({ name: "Artist1", grammy: 0 });
		});

		it("should update artist", async () => {
			const res = await request(app)
				.put(`/api/v1/artists/${artist.id}`)
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					name: "Artist2",
					grammy: 1,
				});

			expect(res.status).toBe(204);
		});

		it("should return 400 if artist name is empty", async () => {
			const res = await request(app)
				.put(`/api/v1/artists/${artist.id}`)
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					name: "",
					grammy: 1,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});

		it("should return 400 if artist grammy is negative", async () => {
			const res = await request(app)
				.put(`/api/v1/artists/${artist.id}`)
				.set("Authorization", `Bearer ${userToken}`)
				.send({
					name: "Artist2",
					grammy: -1,
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});

		it("should return 404 if artist is not found", async () => {
			const res = await request(app).put("/api/v1/artists/123").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Artist not found.");
		});

		it("should return 401 if not authenticated", async () => {
			const res = await request(app).put("/api/v1/artists/123").send({
				name: "Artist2",
				grammy: 1,
			});

			expect(res.status).toBe(401);
			expect(res.body.message).toBe("Unauthorized Access");
		});

		it("should return 403 if user is not editor or admin", async () => {
			const vieweer = await User.create({
				email: "viewer2@test.com",
				password: "password123",
				role: "viewer",
			});
			const viewerToken = (
				await request(app).post("/api/v1/login").send({
					email: "viewer2@test.com",
					password: "password123",
				})
			).body.data.token;

			const res = await request(app)
				.put(`/api/v1/artists/${artist.id}`)
				.set("Authorization", `Bearer ${viewerToken}`)
				.send({
					name: "Artist2",
					grammy: 1,
				});

			expect(res.status).toBe(403);
			expect(res.body.message).toBe("Forbidden Access");
		});
	});

	describe("DELETE /artists/:id", () => {
		let adminToken;

		beforeAll(async () => {
			await Artist.deleteMany({});
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

		it("should delete artist", async () => {
			const artist = await Artist.create({ name: "Artist1", grammy: 0 });

			const res = await request(app)
				.delete(`/api/v1/artists/${artist.id}`)
				.set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(200);
			expect(res.body.message).toBe(`Artist: ${artist.name} deleted successfully.`);
			expect(await Artist.findById(artist.id)).toBeNull();
		});

		it("should return 404 if artist is not found", async () => {
			const res = await request(app).delete("/api/v1/artists/123").set("Authorization", `Bearer ${adminToken}`);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Artist not found.");
		});

		it("should return 401 if not authenticated", async () => {
			const res = await request(app).delete("/api/v1/artists/123");

			expect(res.status).toBe(401);
			expect(res.body.message).toBe("Unauthorized Access");
		});

		it("should return 403 if user is not editor or admin", async () => {
			const viewer = await User.create({
				email: "viewer3@test.com",
				password: "password123",
				role: "viewer",
			});
			const viewerToken = (
				await request(app).post("/api/v1/login").send({
					email: "viewer3@test.com",
					password: "password123",
				})
			).body.data.token;

			const res = await request(app).delete("/api/v1/artists/123").set("Authorization", `Bearer ${viewerToken}`);

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
