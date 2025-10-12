import * as path from "node:path";
import * as dotenv from "dotenv";

// これをjestのsetupFilesに指定すること
// https://zenn.dev/waddy/articles/nestjs-configuration-service
// **E2EではRedisに接続するため、このファイルを使ってはいけない！**

const testEnv = dotenv.config({
	path: path.join(process.cwd(), ".env.testing"),
});

Object.assign(process.env, {
	...testEnv.parsed,
});
