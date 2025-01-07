import mongoose from "mongoose";
import request from "supertest";

import app from "../index.js";
import Album from "../models/album.model.js";
import Artist from "../models/artist.model.js";
import User from "../models/user.model.js";

describe("Album Entity", () => {
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

	describe("GET /albums", () => {
		let artist;

		beforeAll(async () => {
			await Album.deleteMany({});
			await Artist.deleteMany({});

			artist = await Artist.create({ name: "Artist1" });
			await Album.create({ name: "Album1", artist_id: artist.id, year: 2020 });
			await Album.create({ name: "Album2", artist_id: artist.id, year: 2020 });
			await Album.create({ name: "Album3", artist_id: artist.id, year: 2020 });
		});

		it("should return all albums", async () => {
			const res = await request(app).get("/api/v1/albums").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(3);
			expect(res.body.message).toBe("Albums retrieved successfully.");
		});

		it("should return albums with specified limit and offset", async () => {
			const res = await request(app)
				.get("/api/v1/albums?limit=2&offset=0")
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(2);
			expect(res.body.message).toBe("Albums retrieved successfully.");
		});

		it("should return albums with specified artist_id", async () => {
			const res = await request(app)
				.get(`/api/v1/albums?artist_id=${artist.id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data).toHaveLength(3);
			expect(res.body.message).toBe("Albums retrieved successfully.");
		});
	});

	describe("GET /albums/:id", () => {
		let artist;

		beforeAll(async () => {
			await Album.deleteMany({});
			await Artist.deleteMany({});

			artist = await Artist.create({ name: "Artist1" });
		});

		it("should return album by id", async () => {
			const album = await Album.create({ name: "Album1", artist_id: artist.id, year: 2020 });

			const res = await request(app)
				.get(`/api/v1/albums/${album.id}`)
				.set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(200);
			expect(res.body.data.artist_name).toBe(artist.name);
			expect(res.body.data.name).toBe(album.name);
			expect(res.body.data.year).toBe(album.year);
			expect(res.body.message).toBe("Album retrieved successfully.");
		});

		it("should return 404 if album not found", async () => {
			const res = await request(app).get("/api/v1/albums/1234567890").set("Authorization", `Bearer ${userToken}`);

			expect(res.status).toBe(404);
			expect(res.body.message).toBe("Album not found.");
		});
	});

	describe("POST /albums", () => {
		it("should create new album", async () => {
			const artist = await Artist.create({ name: "Artist1" });
			const res = await request(app)
				.post("/api/v1/albums/add-album")
				.set("Authorization", `Bearer ${userToken}`)
				.send({ name: "Album1", artist_id: artist.id, year: 2020 });

			expect(res.status).toBe(201);
			expect(res.body.message).toBe("Album created successfully.");
		});

		it("should return 400 if validation fails", async () => {
			const res = await request(app)
				.post("/api/v1/albums/add-album")
				.set("Authorization", `Bearer ${userToken}`)
				.send({});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe("Bad Request");
		});
	});

	afterAll(async () => {
		await User.deleteMany({});
		await mongoose.connection.close();
		await app.closeServer();
	});
});
