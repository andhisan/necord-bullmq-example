import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import { DeployNotificationDTO } from "@/domain/interfaces/jobs/deployNotification.dto";
import { SendDeployNotificationUseCase } from "@/domain/use-cases/notification/send-deploy-notification.usecase";
import { QueueName } from "@/roles/shared.module";

@Processor(QueueName["deploy-notification"])
export class DeployNotificationConsumer extends WorkerHost {
	private readonly logger = new Logger(DeployNotificationConsumer.name);

	public constructor(
		private readonly sendDeployNotificationUseCase: SendDeployNotificationUseCase,
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

	async process(job: Job<DeployNotificationDTO>): Promise<void> {
		try {
			const { pre } = job.data as DeployNotificationDTO;

			await this.sendDeployNotificationUseCase.execute(pre);
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
