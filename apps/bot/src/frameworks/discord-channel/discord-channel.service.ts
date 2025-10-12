import { Injectable } from "@nestjs/common";
import { Client, MessageCreateOptions, MessagePayload } from "discord.js";
import { IDiscordChannelService } from "@/domain/services/discord-channel.service.interface";
import { RootConfig } from "../config";

@Injectable()
export class DiscordChannelService implements IDiscordChannelService {
	constructor(
		private readonly config: RootConfig,
		private readonly client: Client,
	) {}

	/** 開発者のメンション(末尾に半角スペースを付ける) */
	public getDeveloperMentionString(): string {
		const developerUserId = this.config.discord.developer_user_id;
		return `<@${developerUserId}> `;
	}

	/**
	 * 環境に応じたadmin用通知チャンネルを取得
	 */
	private async getAdminNotificationChannel() {
		const appEnv = this.config.app_env;
		const notificationChannelId =
			this.config.discord.adminNotificationChannels[appEnv];
		return await this.client.channels.cache.get(notificationChannelId);
	}

	private async getUserNotificationChannel() {
		const appEnv = this.config.app_env;
		const notificationChannelId =
			this.config.discord.userNotificationChannels[appEnv];
		return await this.client.channels.cache.get(notificationChannelId);
	}

	/**
	 * ※MessagePayloadを自由に組み立てたいので、
	 * あえてこのメソッドにはshouldMentionDeveloperを渡さない
	 */
	async sendMessageToAdminNotificationChannel(
		options: string | MessagePayload | MessageCreateOptions,
	) {
		const channel = await this.getAdminNotificationChannel();
		if (channel?.isSendable()) {
			await channel.send(options);
		} else {
			throw new Error("管理者用通知チャンネルが存在しません");
		}
	}

	async sendMessageToUserNotificationChannel(
		options: string | MessagePayload | MessageCreateOptions,
	) {
		const channel = await this.getUserNotificationChannel();
		if (channel?.isSendable()) {
			await channel.send(options);
		} else {
			await this.sendMessageToAdminNotificationChannel({
				content: `ユーザー用通知チャンネルが削除されています`,
			});
		}
	}
}
