import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const clientDir = "dist/client";
const assetsDir = join(clientDir, "assets");

function getBasePath() {
  if (process.env.GITHUB_PAGES !== "true") return "/";
  const repoName = process.env.GITHUB_REPOSITORY?.split("/").pop()?.trim();
  return repoName ? `/${repoName}/` : "/";
}

const assets = await readdir(assetsDir);
const entryScript = assets.find((name) => /^index-[\w-]+\.js$/.test(name));
const routeScript = assets.find((name) => /^routes-[\w-]+\.js$/.test(name));
const stylesheets = assets.filter((name) => /^styles-[\w-]+\.css$/.test(name)).sort();

if (!entryScript) {
  throw new Error("Cannot create GitHub Pages index: client entry asset was not found");
}

const basePath = getBasePath();
const entryScriptPath = `${basePath}assets/${entryScript}`;
const routeScriptPath = routeScript ? `${basePath}assets/${routeScript}` : undefined;
const stylesheetLinks = stylesheets
  .map((name) => `    <link rel="stylesheet" crossorigin href="${basePath}assets/${name}">`)
  .join("\n");
const routePreloads = routeScriptPath ? `"${routeScriptPath}"` : "";
const bootstrapScript = `(self.$R=self.$R||{})["tsr"]=[];
self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};
$_TSR.router={manifest:{routes:{__root__:{preloads:["${entryScriptPath}"],assets:[{tag:"script",attrs:{type:"module",async:true},children:"import(\\"${entryScriptPath}\\")"}]},"/":{preloads:[${routePreloads}]}}},matches:[{i:"__root__\\u0000",s:"success",ssr:true},{i:"\\u0000\\u0000",s:"success",ssr:true}],lastMatchId:"\\u0000\\u0000"};
$_TSR.e();
document.currentScript.remove();`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription — VPN</title>
${stylesheetLinks}
    <link rel="modulepreload" href="${entryScriptPath}">
    ${routeScriptPath ? `<link rel="modulepreload" href="${routeScriptPath}">` : ""}
  </head>
  <body>
    <script class="$tsr" id="$tsr-stream-barrier">${bootstrapScript}</script>
    <script type="module" async>import("${entryScriptPath}")</script>
  </body>
</html>
`;

await writeFile(join(clientDir, "index.html"), html);
await writeFile(join(clientDir, "404.html"), html);
await writeFile(join(clientDir, ".nojekyll"), "");
