/**
 * このファイルはコマンド実行時のエントリポイントとして指定する
 * @packageDocumentation
 */

import { CommandFactory } from "nest-commander";
import {
	utilities as nestWinstonModuleUtilities,
	WinstonModule,
} from "nest-winston";
import * as winston from "winston";
import { CliModule } from "./roles/cli.module";

async function bootstrap() {
	const appName = "cli";
	const appModule = CliModule;

	const app = await CommandFactory.createWithoutRunning(appModule, {
		// ロガーをWinstonで置換する
		// https://github.com/gremo/nest-winston?tab=readme-ov-file#replacing-the-nest-logger-also-for-bootstrapping
		logger: WinstonModule.createLogger({
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.ms(),
						nestWinstonModuleUtilities.format.nestLike(appName, {
							colors: true,
							prettyPrint: true,
							processId: true,
							appName: true,
						}),
					),
				}),
			],
		}),
	});
	await CommandFactory.runApplication(app);
	// これがないとプロセスが永続してしまう
	app.close();
}
bootstrap();
