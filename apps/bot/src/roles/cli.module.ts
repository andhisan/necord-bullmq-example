import { Module } from "@nestjs/common";
import { SharedModule } from "@/roles/shared.module";
import { CommandsModule } from "../gateways/commands/commands.module";

/**
 * CLIモジュールはNecordやqueueのConsumerを使用しない
 */
@Module({
	imports: [CommandsModule, SharedModule],
	controllers: [],
	providers: [],
})
export class CliModule {}
