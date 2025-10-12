import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";

class HealthcheckResult {
	@ApiProperty({ example: "ok" })
	message: "ok";
}

@Controller("/")
export class HealthcheckController {
	@Get("/up")
	@ApiOperation({ description: "ヘルスチェック用エンドポイント" })
	@ApiOkResponse({ type: HealthcheckResult })
	async up(): Promise<HealthcheckResult> {
		return {
			message: "ok",
		};
	}
}
