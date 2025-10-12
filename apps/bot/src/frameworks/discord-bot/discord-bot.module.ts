import { Module } from "@nestjs/common";
import { DiscordChannelModule } from "../discord-channel/discord-channel.module";
import { DiscordChannelService } from "../discord-channel/discord-channel.service";
import { DiscordChannelService as DiscordChannelMockService } from "../discord-channel-mock/discord-channel.service";
import { DiscordChannelMockModule } from "../discord-channel-mock/discord-channel-mock.module";
import { DISCORD_CHANNEL_SERVICE } from "../nest/constants";
import { DiscordBotService } from "./discord-bot.service";

/**
 * 注意
 * このBOTは、絶対にSharedModuleにインポートしてはいけない。
 * SharedModuleはCLIでも使われるが、CLIにnecordモジュールを渡すと、
 * 一時的に二重でbotが立ち上がってしまう。
 */
@Module({
	imports: [DiscordChannelModule, DiscordChannelMockModule],
	providers: [
		DiscordBotService,
		{
			provide: DISCORD_CHANNEL_SERVICE,
			useExisting: process.env.MOCK
				? DiscordChannelMockService
				: DiscordChannelService,
		},
	],
	exports: [DISCORD_CHANNEL_SERVICE],
})
export class DiscordBotModule {}
