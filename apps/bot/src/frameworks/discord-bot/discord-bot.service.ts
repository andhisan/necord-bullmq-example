import { Inject, Injectable, Logger } from "@nestjs/common";
import { EmbedBuilder, Events } from "discord.js";
import { Context, ContextOf, On, Once } from "necord";
import { IDiscordChannelService } from "@/domain/services/discord-channel.service.interface";
import { DISCORD_CHANNEL_SERVICE } from "../nest/constants";

@Injectable()
export class DiscordBotService {
	private readonly logger = new Logger(DiscordBotService.name);

	public constructor(
		// 他の通知と異なりQueueを経由せず投稿する
		@Inject(DISCORD_CHANNEL_SERVICE)
		private readonly discordChannelService: IDiscordChannelService,
	) {}

	@Once(Events.ClientReady)
	public onReady(@Context() [client]: ContextOf<"ready">) {
		this.logger.log(`Bot logged in as ${client.user.username}`);
	}

	@On(Events.Warn)
	public onWarn(@Context() [message]: ContextOf<"warn">) {
		this.logger.warn(message);

		const embed = new EmbedBuilder()
			.setColor(0xffff00)
			.setTitle("Warn")
			.setDescription(message)
			.setTimestamp();

		// Warn通知をadmin用通知チャンネルに送信する
		this.discordChannelService.sendMessageToAdminNotificationChannel({
			embeds: [embed],
		});
	}

	@On(Events.Error)
	public onError(@Context() [error]: ContextOf<"error">) {
		this.logger.error(error);

		const embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle("Error")
			.setDescription(error.message ?? JSON.stringify(error))
			.setTimestamp();

		// Error通知をadmin用通知チャンネルに送信する
		this.discordChannelService.sendMessageToAdminNotificationChannel({
			embeds: [embed],
		});
	}
}
