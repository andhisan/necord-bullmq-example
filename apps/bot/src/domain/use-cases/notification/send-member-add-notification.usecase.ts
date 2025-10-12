import { Inject, Injectable } from "@nestjs/common";
import { GuildMember } from "discord.js";
import { DiscordChannelService } from "@/frameworks/discord-channel/discord-channel.service";
import { DISCORD_CHANNEL_SERVICE } from "@/frameworks/nest/constants";
import { BaseUseCase } from "../base-use-case.interface";

@Injectable()
export class SendMemberAddNotificationUseCase implements BaseUseCase {
	constructor(
		@Inject(DISCORD_CHANNEL_SERVICE)
		private readonly discordChannelService: DiscordChannelService,
	) {}

	async execute(member: GuildMember) {
		this.discordChannelService.sendMessageToAdminNotificationChannel({
			content: `新規ユーザー参加: ${member.displayName}`,
		});
		this.discordChannelService.sendMessageToUserNotificationChannel({
			content: `${member.displayName}さん、ようこそ！`,
		});
	}
}
