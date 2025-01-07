import mongoose from "mongoose";
import request from "supertest";

import app from "../index.js";
import Album from "../models/album.model.js";
import Artist from "../models/artist.model.js";
import Track from "../models/track.model.js";
import User from "../models/user.model.js";

describe("Track Entity", () => {
	let userToken;
	let artist;
	let album;

	beforeAll(async () => {
		await User.deleteMany({});
		await Album.deleteMany({});
		await Artist.deleteMany({});
		await Track.deleteMany({});

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

		artist = await Artist.create({ name: "Artist1" });
		album = await Album.create({ name: "Album1", artist_id: artist.id, year: 2020 });
	});

	describe("GET /tracks", () => {
		beforeEach(async () => {
			await Track.deleteMany({});
			await Track.create({ name: "Track1", artist_id: artist.id, album_id: album.id, duration: 300 });
			await Track.create({ name: "Track2", artist_id: artist.id, album_id: album.id, duration: 320 });
			await Track.create({ name: "Track3", artist_id: artist.id, album_id: album.id, duration: 340 });
		});

		it("should return all tracks", async () => {
			const res = await request(app).get("/api/v1/tracks").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(3);
			expect(res.body.message).toBe("Tracks retrieved successfully.");
		});

		it("should return tracks with specified limit and offset", async () => {
			const res = await request(app)
				.get("/api/v1/tracks?limit=2&offset=0")
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(2);
			expect(res.body.message).toBe("Tracks retrieved successfully.");
		});

		it("should return tracks with specified album_id", async () => {
			const res = await request(app)
				.get(`/api/v1/tracks?album_id=${album.id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(3);
			expect(res.body.message).toBe("Tracks retrieved successfully.");
		});
	});

	describe("GET /tracks/:id", () => {
		it("should return track by id", async () => {
			const track = await Track.create({
				name: "Track3",
				artist_id: artist.id,
				album_id: album.id,
				duration: 300,
			});

			const res = await request(app)
				.get(`/api/v1/tracks/${track.id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data._id).toBe(track.id);
			expect(res.body.message).toBe("Track retrieved successfully.");
		});

		it("should return 404 if track not found", async () => {
			const res = await request(app).get("/api/v1/tracks/1234567890").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Track not found.");
		});
	});

	describe("POST /tracks", () => {
		it("should create new track", async () => {
			const res = await request(app)
				.post("/api/v1/tracks/add-track")
				.set("Authorization", `Bearer ${userToken}`)
				.send({ name: "Track4", artist_id: artist.id, album_id: album.id, duration: 300 });

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("Track created successfully.");
		});

		it("should return 400 if track name is empty", async () => {
			const res = await request(app)
				.post("/api/v1/tracks/add-track")
				.set("Authorization", `Bearer ${userToken}`)
				.send({ name: "", artist_id: artist.id, album_id: album.id, duration: 300 });

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});
	});

	describe("PUT /tracks/:id", () => {
		let track;

		beforeEach(async () => {
			track = await Track.create({ name: "Track5", artist_id: artist.id, album_id: album.id, duration: 300 });
		});

		afterEach(async () => {
			await Track.findByIdAndDelete(track.id);
		});

		it("should update track", async () => {
			const res = await request(app)
				.put(`/api/v1/tracks/${track.id}`)
				.set("Authorization", `Bearer ${userToken}`)
				.send({ name: "Updated Track5", duration: 320, hidden: false });

			expect(res.status).toBe(204);
		});

		it("should return 404 if track is not found", async () => {
			const res = await request(app)
				.put("/api/v1/tracks/123")
				.set("Authorization", `Bearer ${userToken}`)
				.send({ name: "Track6" });

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Track not found.");
		});
	});

	describe("DELETE /tracks/:id", () => {
		let track;

		beforeEach(async () => {
			track = await Track.create({ name: "Track7", artist_id: artist.id, album_id: album.id, duration: 300 });
		});

		afterEach(async () => {
			await Track.findByIdAndDelete(track.id);
		});

		it("should delete track", async () => {
			const res = await request(app)
				.delete(`/api/v1/tracks/${track.id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(await Track.findById(track.id)).toBeNull();
			expect(res.body.message).toBe(`Track: ${track.name} deleted successfully.`);
		});

		it("should return 404 if track is not found", async () => {
			const res = await request(app).delete("/api/v1/tracks/123").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Track not found.");
		});
	});

	afterAll(async () => {
		await User.deleteMany({});
		await Album.deleteMany({});
		await Artist.deleteMany({});
		await Track.deleteMany({});
		await mongoose.connection.close();
		await app.closeServer();
	});
});
