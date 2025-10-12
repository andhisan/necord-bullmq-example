import { INestApplication, Type } from "@nestjs/common";
import { SpelunkerModule } from "nestjs-spelunker";

/**
 * 出てきたログを [Mermaid Live Editor](https://mermaid.live/edit) に張り付ければ
 * アプリの依存関係を可視化できる
 * @see https://stackoverflow.com/questions/60359190/how-to-get-dependency-tree-graph-in-nestjs
 */
export function getMermaidGraph(app: INestApplication) {
	const tree = SpelunkerModule.explore(app);
	const root = SpelunkerModule.graph(tree);
	const edges = SpelunkerModule.findGraphEdges(root);
	const mermaidEdges = edges.map(
		({ from, to }) => `${from.module.name} --> ${to.module.name}`,
	);
	return `graph TD\n\t${mermaidEdges.join("\n\t")}`;
}

/**
 * モジュールの依存関係を取得する
 */
export async function debugModuleUsingMermaidGraph(module: Type) {
	const debugTree = await SpelunkerModule.debug(module);
	return JSON.stringify(debugTree, null, 2);
}
