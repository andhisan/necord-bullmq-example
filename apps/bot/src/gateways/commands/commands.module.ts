import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { getRegisterQueueOptions } from "@/roles/shared.module";
import { DeployCommand } from "./notification/deploy.command";

@Module({
	imports: [
		BullModule.registerQueue(getRegisterQueueOptions("deploy-notification")),
	],
	providers: [DeployCommand],
})
export class CommandsModule {}
