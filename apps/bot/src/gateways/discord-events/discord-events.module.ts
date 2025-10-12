import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { getRegisterQueueOptions } from "@/roles/shared.module";
import { GuildMemberAddEvent } from "./guild-member-add.event";

/**
 * アクションをトリガーするイベント
 *
 * 注意: Error, WarnはDiscordBotServiceで処理する
 */
const events = [GuildMemberAddEvent];

@Module({
	imports: [
		BullModule.registerQueue(
			getRegisterQueueOptions("member-add-notification"),
		),
	],
	providers: [...events],
	exports: [...events], // exportしないイベントには反応しない
})
export class DiscordEventsModule {}
