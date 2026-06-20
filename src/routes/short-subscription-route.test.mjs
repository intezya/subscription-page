import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const routeTree = readFileSync(resolve(__dirname, "../routeTree.gen.ts"), "utf8");

assert.match(routeTree, /path:\s*'\/\$shortUuid'/);
assert.match(routeTree, /fullPaths:\s*[^;]*'\/\$shortUuid'/);
