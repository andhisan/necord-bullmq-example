/**
 * このファイルには、BOTモジュールとCLIモジュールで共有される内容を設置
 * @packageDocumentation
 */

import { BullModule, RegisterQueueOptions } from "@nestjs/bullmq";
import { Global, Module } from "@nestjs/common";
import {
	dotenvLoader,
	TypedConfigModule,
	TypedConfigModuleOptions,
} from "nest-typed-config";
import { RootConfig } from "../frameworks/config";

// ===================================================================
// キューの名前

export enum QueueName {
	"deploy-notification" = "deploy-notification",
	"member-add-notification" = "member-add-notification",
}
const queueOptions: Record<
	keyof typeof QueueName,
	Omit<RegisterQueueOptions, "name">
> = {
	"deploy-notification": {
		defaultJobOptions: {
			removeOnComplete: true,
		},
	},
	"member-add-notification": {
		defaultJobOptions: {
			removeOnComplete: true,
		},
	},
};

/**
 * 各モジュールでQueueを使用する際に使用する
 * @example
 * ```ts
 *	imports: [
 *		BullModule.registerQueue(getRegisterQueueOptions("deploy-notification")),
 *	],
 * ```
 */
export function getRegisterQueueOptions(
	name: keyof typeof QueueName,
): RegisterQueueOptions {
	return {
		name: QueueName[name],
		...queueOptions[name],
	};
}

/**
 * ロール共通で使用するほか、
 * テスト時のモジュールでもimportする必要がある
 */
export const typedConfigModuleOptions = {
	schema: RootConfig,
	load: dotenvLoader({
		separator: "__", // 環境変数の区切り文字
		// 大文字の環境変数を小文字に変換して取得できるように
		// 例: DISCORD__TOKEN -> discord.token
		keyTransformer: (key: string) => key.toLowerCase(),
	}),
} satisfies TypedConfigModuleOptions;

@Global()
@Module({
	imports: [
		TypedConfigModule.forRoot(typedConfigModuleOptions),
		BullModule.forRootAsync({
			inject: [RootConfig],
			useFactory: async (rootConfig: RootConfig) => {
				const isUpstashRedis = rootConfig.redis.url.includes("upstash.io");
				return {
					connection: {
						url: rootConfig.redis.url,
						// upstashの場合はIPv6を指定しないとENOTFOUNDエラーになる
						family: isUpstashRedis ? 6 : undefined,
					},
				};
			},
		}),
	],
	providers: [],
	exports: [],
})
export class SharedModule {}
