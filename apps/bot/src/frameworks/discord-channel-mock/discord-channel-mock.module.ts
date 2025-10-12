import { Module } from "@nestjs/common";
import { DiscordChannelService } from "./discord-channel.service";

@Module({
	providers: [DiscordChannelService],
	exports: [DiscordChannelService],
})
export class DiscordChannelMockModule {}
