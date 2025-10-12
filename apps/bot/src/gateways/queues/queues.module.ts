/**
 * Consumerを定義したら必ずこのモジュールに追加すること
 *
 * @packageDocumentation
 */

import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { NotificationUseCasesModule } from "@/domain/use-cases/notification/notification-use-cases.module";
import { getRegisterQueueOptions } from "@/roles/shared.module";
import { DeployNotificationConsumer } from "./deploy-notification.consumer";
import { UserAddNotificationConsumer } from "./user-add-notification.consumer";

const consumers = [DeployNotificationConsumer, UserAddNotificationConsumer];

@Module({
	imports: [
		BullModule.registerQueue(getRegisterQueueOptions("deploy-notification")),
		BullModule.registerQueue(
			getRegisterQueueOptions("member-add-notification"),
		),
		NotificationUseCasesModule,
	],
	providers: [...consumers],
})
export class QueuesModule {}
