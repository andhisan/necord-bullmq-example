import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { MemberAddNotificationDTO } from "@/domain/interfaces/jobs/memberAddNotification.dto";
import { SendMemberAddNotificationUseCase } from "@/domain/use-cases/notification/send-member-add-notification.usecase";
import { QueueName } from "@/roles/shared.module";

@Processor(QueueName["member-add-notification"])
export class UserAddNotificationConsumer extends WorkerHost {
	private readonly logger = new Logger(UserAddNotificationConsumer.name);

	public constructor(
		private readonly sendMemberAddNotificationUseCase: SendMemberAddNotificationUseCase,
	) {
		super();
	}

	@OnWorkerEvent("active")
	onActive(job: Job) {
		this.logger.log(
			`Processing job [${job.id}] (${job.name}) with data: ` +
				JSON.stringify(job.data),
		);
	}

	async process(job: Job<MemberAddNotificationDTO>): Promise<void> {
		try {
			const { member } = job.data;
			await this.sendMemberAddNotificationUseCase.execute(member);
		} catch (e) {
			this.logger.error(
				`Job ${job.id} of type ${job.name} failed with error: ${e.message}`,
				e,
			);

			// 注意: BullMQのジョブに対してはErrorをThrowすることでリトライを判定する
			throw e;
		}
	}
}
