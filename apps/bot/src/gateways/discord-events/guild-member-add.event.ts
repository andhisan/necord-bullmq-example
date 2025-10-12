import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { Events, MessageType } from "discord.js";
import { Context, ContextOf, On } from "necord";
import { MemberAddNotificationDTO } from "@/domain/interfaces/jobs/memberAddNotification.dto";
import { QueueName } from "@/roles/shared.module";

@Injectable()
export class GuildMemberAddEvent {
	private readonly logger = new Logger(GuildMemberAddEvent.name);

	constructor(
		@InjectQueue(QueueName["member-add-notification"])
		private userAddNotificationQueue: Queue<MemberAddNotificationDTO>,
	) {}

	/**
	 * `GuildMemberAdd` はdeprecatedのため
	 * 参加メッセージで判断する
	 * https://zenn.dev/r64/articles/785f3824d0477f
	 */
	@On(Events.MessageCreate)
	public async onGuildMemberAdd(
		@Context() [message]: ContextOf<Events.MessageCreate>,
	) {
		if (message.type === MessageType.UserJoin && message.member) {
			this.logger.debug("triggering onGuildMemberAdd");
			await this.userAddNotificationQueue.add("notify", {
				member: message.member,
			});
		}
	}
}
