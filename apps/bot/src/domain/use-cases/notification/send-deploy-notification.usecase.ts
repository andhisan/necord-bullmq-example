import { Inject, Injectable } from "@nestjs/common";
import { EmbedBuilder } from "discord.js";
import { RootConfig } from "@/frameworks/config";
import { DiscordChannelService } from "@/frameworks/discord-channel/discord-channel.service";
import { DISCORD_CHANNEL_SERVICE } from "@/frameworks/nest/constants";
import { BaseUseCase } from "../base-use-case.interface";

@Injectable()
export class SendDeployNotificationUseCase implements BaseUseCase {
	constructor(
		private readonly config: RootConfig,
		@Inject(DISCORD_CHANNEL_SERVICE)
		private readonly discordChannelService: DiscordChannelService,
	) {}

	async execute(pre?: boolean): Promise<void> {
		const appEnv = this.config.app_env;
		if (pre) {
			await this.discordChannelService.sendMessageToAdminNotificationChannel(
				"bot更新開始。既存ジョブの進捗に影響がないか注意してください。",
			);
			return;
		}

		const embed = new EmbedBuilder({
			title: `necordbullmqbot@${appEnv}`,
		}).setFields([
			{
				name: "version",
				value: this.config.commit_sha,
			},
		]);
		await this.discordChannelService.sendMessageToAdminNotificationChannel({
			content: "bot更新完了。",
			embeds: [embed],
		});
	}
}
