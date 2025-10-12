import { MessageCreateOptions, MessagePayload } from "discord.js";

export interface IDiscordChannelService {
	getDeveloperMentionString(): string;

	sendMessageToAdminNotificationChannel(
		options: string | MessagePayload | MessageCreateOptions,
	): Promise<void>;

	sendMessageToUserNotificationChannel(
		options: string | MessagePayload | MessageCreateOptions,
	): Promise<void>;
}
