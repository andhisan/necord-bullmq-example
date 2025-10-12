import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import type { App } from "supertest/types";
import { BotModule } from "@/roles/bot.module";

describe("BotController (e2e)", () => {
	let app: INestApplication<App>;
	let server: App;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [BotModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		server = app.getHttpServer();
		await app.init();
	});

	// e2eが終了しない問題を解決
	// https://stackoverflow.com/a/71899222
	afterEach(async () => {
		await app.close();
	});

	it("GET /up", () => {
		return request(server).get("/up").expect(200);
	});
});
