/**
 * このファイルはコンテナのエントリポイントとして指定する
 * @packageDocumentation
 */
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
	utilities as nestWinstonModuleUtilities,
	WinstonModule,
} from "nest-winston";
import * as winston from "winston";
// import { debugModuleUsingMermaidGraph, getMermaidGraph } from "@/frameworks/nest/debug";
import { BotModule } from "./roles/bot.module";

async function bootstrap() {
	const appName = "bot";
	const appModule = BotModule;

	// モジュールのデバッグ
	// if (process.env.NODE_ENV !== "production") {
	// 	console.debug(await debugModuleUsingMermaidGraph(appModule));
	// }

	const app = await NestFactory.create(appModule, {
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

	// アプリ全体の依存関係グラフ
	// if (process.env.NODE_ENV !== "production") {
	// 	console.debug(getMermaidGraph(app));
	// }

	// HTTP APIのドキュメントを /api に公開する
	if (process.env.NODE_ENV !== "production") {
		const config = new DocumentBuilder()
			.setTitle("necordbullmqbot")
			.setVersion("1.0")
			.addBearerAuth({
				type: "apiKey",
			})
			.build();
		const documentFactory = () => SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api", app, documentFactory);
	}

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
