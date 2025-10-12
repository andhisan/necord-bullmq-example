import { Module } from "@nestjs/common";
import { DiscordChannelService } from "./discord-channel.service";

/**
 * 注意:
 *
 * このモジュールはNecordモジュール無しでは動作できないため、
 * 絶対にCLI側 (=shared.ts) にインポートしてはいけない
 */
@Module({
	providers: [DiscordChannelService],
	exports: [DiscordChannelService],
})
export class DiscordChannelModule {}
