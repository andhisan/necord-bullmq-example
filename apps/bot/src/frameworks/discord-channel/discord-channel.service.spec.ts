import { Test, TestingModule } from "@nestjs/testing";
import { NecordModule } from "necord";
import { TypedConfigModule } from "nest-typed-config";
import { typedConfigModuleOptions } from "@/roles/shared.module";
import { DiscordChannelService } from "./discord-channel.service";

describe("DiscordChannelService", () => {
	let discordChannelService: DiscordChannelService;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [
				NecordModule.forRoot({ token: "", intents: [] }),
				TypedConfigModule.forRoot(typedConfigModuleOptions),
			],
			controllers: [DiscordChannelService],
		}).compile();

		discordChannelService = app.get<DiscordChannelService>(
			DiscordChannelService,
		);
	});

	describe("getDeveloperMentionString", () => {
		it("should return valid mention with space", () => {
			expect(discordChannelService.getDeveloperMentionString()).toBe(
				"<@000000000000000000> ",
			);
		});
	});
});
