import { InjectQueue } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { Command, CommandRunner, Option } from "nest-commander";
import { DeployNotificationDTO } from "@/domain/interfaces/jobs/deployNotification.dto";
import { QueueName } from "@/roles/shared.module";

type CommandOptions = {
	pre?: boolean;
};

@Command({
	name: "notification:deploy",
	description: "デプロイ通知を飛ばす",
})
export class DeployCommand extends CommandRunner {
	private readonly logger = new Logger(DeployCommand.name);

	constructor(
		@InjectQueue(QueueName["deploy-notification"])
		private deployNotificationQueue: Queue<DeployNotificationDTO>,
	) {
		super();
	}

	@Option({
		flags: "--pre [bool]",
		description: "pre-deployならtrue",
		required: false,
	})
	parsePre(option?: string) {
		this.logger.log(`parsePre called with option: ${option}`);
		return !!option;
	}

	async run(_args: string[], options?: CommandOptions): Promise<void> {
		await this.deployNotificationQueue.add("deploy", {
			pre: options?.pre ?? false,
		});
	}
}
