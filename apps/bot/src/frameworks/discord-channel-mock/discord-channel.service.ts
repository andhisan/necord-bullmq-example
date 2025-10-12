import { Injectable, Logger } from "@nestjs/common";
import { MessageCreateOptions, MessagePayload } from "discord.js";
import { IDiscordChannelService } from "@/domain/services/discord-channel.service.interface";

@Injectable()
export class DiscordChannelService implements IDiscordChannelService {
	private readonly logger = new Logger(DiscordChannelService.name);

	public getDeveloperMentionString(): string {
		this.logger.debug("mocking getDeveloperMentionString");
		return "<@123456789012345678> ";
	}

	async sendMessageToAdminNotificationChannel(
		options: string | MessagePayload | MessageCreateOptions,
	) {
		this.logger.debug(
			`mocking sendMessageToAdminNotificationChannel: ${JSON.stringify(options)}`,
		);
	}

	async sendMessageToUserNotificationChannel(
		options: string | MessagePayload | MessageCreateOptions,
	) {
		this.logger.debug(
			`mocking sendMessageToUserNotificationChannel: ${JSON.stringify(options)}`,
		);
	}

	async sendMessageToCurationNotificationChannel(
		options: string | MessagePayload | MessageCreateOptions,
	) {
		this.logger.debug(
			`mocking sendMessageToCurationNotificationChannel: ${JSON.stringify(options)}`,
		);
	}
}
