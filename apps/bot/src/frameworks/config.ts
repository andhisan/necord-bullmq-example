/**
 * 型安全にコンフィグを管理するためのClass群
 * @see https://github.com/Nikaple/nest-typed-config
 *
 * @packageDocumentation
 */

import { Type } from "class-transformer";
import {
	IsEnum,
	IsNotEmptyObject,
	IsNumber,
	IsString,
	ValidateNested,
} from "class-validator";

export class DiscordConfig {
	/** DISCORD__TOKEN */
	@IsString()
	public readonly token!: string;
	/** DISCORD__DEVELOPER_USER_ID */
	@IsString()
	public readonly developer_user_id!: string;

	/**
	 * 環境変数をこれ以上増やしたくないのでハードコーディング
	 */
	@IsNotEmptyObject()
	public readonly adminNotificationChannels: Record<AppEnv, string> = {
		testing: "000000000000000000", // テスト環境は通知しない
		local: "1426831930623791114",
		staging: "000000000000000000", // 適宜設定すること
		production: "000000000000000000",
	};

	@IsNotEmptyObject()
	public readonly userNotificationChannels: Record<AppEnv, string> = {
		testing: "000000000000000000", // テスト環境は通知しない
		local: "1426831814844219462",
		staging: "000000000000000000", // 適宜設定すること
		production: "000000000000000000",
	};
}

export class RedisConfig {
	/** REDIS__URL */
	@IsString()
	public readonly url!: string;
}

enum AppEnv {
	testing = "testing",
	local = "local",
	staging = "staging",
	production = "production",
}

export class RootConfig {
	@Type(() => DiscordConfig)
	@ValidateNested()
	public readonly discord!: DiscordConfig;

	@Type(() => RedisConfig)
	@ValidateNested()
	public readonly redis!: RedisConfig;

	/** PORT */
	@IsNumber()
	public readonly port: number = 3000;

	// アンダースコア一つで区切った環境変数は、小文字スネークケースに変換される

	/** APP_ENV */
	@IsEnum(AppEnv)
	public readonly app_env: AppEnv;

	/** COMMIT_SHA */
	@IsString()
	public readonly commit_sha!: string;
}
