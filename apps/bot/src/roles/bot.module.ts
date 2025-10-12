import { Module } from "@nestjs/common";
import { NecordModule } from "necord";
import { DiscordBotModule } from "@/frameworks/discord-bot/discord-bot.module";
import { DiscordChannelModule } from "@/frameworks/discord-channel/discord-channel.module";
import { DiscordChannelMockModule } from "@/frameworks/discord-channel-mock/discord-channel-mock.module";
import { ControllersModule } from "@/gateways/controllers/controllers.module";
import { DiscordEventsModule } from "@/gateways/discord-events/discord-events.module";
import { QueuesModule } from "@/gateways/queues/queues.module";
import { RootConfig } from "../frameworks/config";
import { SharedModule } from "./shared.module";

@Module({
	imports: [
		ControllersModule,
		DiscordBotModule,
		DiscordEventsModule,
		DiscordChannelModule,
		DiscordChannelMockModule,
		// Discord Botの設定
		// https://github.com/necordjs/necord
		NecordModule.forRootAsync({
			// トークンの設定にTypedConfigModuleを使う必要があるためuseFactory
			inject: [RootConfig],
			useFactory: async (rootConfig: RootConfig) => {
				return {
					token: rootConfig.discord.token,
					// @see https://discord.com/developers/docs/events/gateway#list-of-intents
					// @see https://scrapbox.io/discordjs-japan/Gateway_Intents_%E3%81%AE%E5%88%A9%E7%94%A8%E3%81%AB%E9%96%A2%E3%81%99%E3%82%8B%E3%82%AC%E3%82%A4%E3%83%89
					intents: [
						"Guilds", // 必須
						"GuildMessages", // テキストベースチャンネルの更新情報等
						"DirectMessages", // DMの更新情報等
						"GuildMembers", // (Privileged) メンバー一括取得等
						"MessageContent", // (Privileged) メッセージ内容
					],
				};
			},
		}),
		QueuesModule,
		SharedModule,
	],
	controllers: [],
})
export class BotModule {}
