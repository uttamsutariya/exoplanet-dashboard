const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
	beforeAll(async () => await mongoConnect());
	afterAll(async () => await mongoDisconnect());

	// describe => test fixture
	// assertions => expect (from jest), can also use from supertest -> .expect()
	describe("Test GET /lanches", () => {
		test("It should response with 200 success", async () => {
			await request(app).get("/launches").expect("Content-Type", /json/).expect(200);
		});
	});

	describe("Test POST /launches", () => {
		const completeLaunchData = {
			mission: "USS",
			rocket: "xyzxyz",
			target: "kepler-296 f",
			launchDate: "January 4, 2028",
		};

		const launchDataWithoutDate = {
			mission: "USS",
			rocket: "xyzxyz",
			target: "kepler-296 f",
		};

		const launchDataWithInvalidDate = {
			mission: "USS",
			rocket: "xyzxyz",
			target: "kepler-296 f",
			launchDate: "cool",
		};

		/**
		 *  test: poset data
		 */
		test("It should response with 201 created", async () => {
			const response = await request(app)
				.post("/launches")
				.send(completeLaunchData)
				.expect("Content-Type", /json/)
				.expect(201);

			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();

			expect(requestDate).toBe(responseDate);
			expect(response.body).toMatchObject(launchDataWithoutDate);
		});

		/**
		 * test: check mission data
		 */
		test("It should catch missing required properties", async () => {
			const response = await request(app)
				.post("/launches")
				.send(launchDataWithoutDate)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: "Missing required launch properties",
			});
		});

		/**
		 * test: check invalid date
		 */
		test("It should catch invalid dates", async () => {
			const response = await request(app)
				.post("/launches")
				.send(launchDataWithInvalidDate)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: "Invalid launch date",
			});
		});
	});
});
