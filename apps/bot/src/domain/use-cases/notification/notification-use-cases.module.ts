/**
 * QueueのConsumerで使用するユースケース
 *
 * @packageDocumentation
 */

import { Module } from "@nestjs/common";
import { DiscordChannelModule } from "@/frameworks/discord-channel/discord-channel.module";
import { DiscordChannelService } from "@/frameworks/discord-channel/discord-channel.service";
import { DiscordChannelService as DiscordChannelMockService } from "@/frameworks/discord-channel-mock/discord-channel.service";
import { DiscordChannelMockModule } from "@/frameworks/discord-channel-mock/discord-channel-mock.module";
import { DISCORD_CHANNEL_SERVICE } from "@/frameworks/nest/constants";
import { SendDeployNotificationUseCase } from "./send-deploy-notification.usecase";
import { SendMemberAddNotificationUseCase } from "./send-member-add-notification.usecase";

const useCases = [
	SendDeployNotificationUseCase,
	SendMemberAddNotificationUseCase,
];

@Module({
	imports: [DiscordChannelModule, DiscordChannelMockModule],
	providers: [
		...useCases,
		{
			provide: DISCORD_CHANNEL_SERVICE,
			useExisting: process.env.MOCK
				? DiscordChannelMockService
				: DiscordChannelService,
		},
	],
	exports: [...useCases],
})
export class NotificationUseCasesModule {}
