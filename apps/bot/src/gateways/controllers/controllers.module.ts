import { Module } from "@nestjs/common";
import { HealthcheckController } from "./healthcheck/healthcheck.controller";

@Module({
	controllers: [HealthcheckController],
})
export class ControllersModule {}
