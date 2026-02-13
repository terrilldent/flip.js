#!/usr/bin/env bun
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const year = new Date().getFullYear();
const versionedName = `${packageJson.name}-v${packageJson.version}`;

const banner = [
  "/*!",
  ` * ${packageJson.name} ${packageJson.version} - Copyright ${year} Terrill Dent, http://terrill.ca`,
  ` * ${packageJson.license}`,
  " */",
  "",
].join("\n");

const distCssDir = join("dist", "css");
const distJsDir = join("dist", "js");

const devCss = join(distCssDir, `${versionedName}.css`);
const devJs = join(distJsDir, `${versionedName}.js`);
const minJs = join(distJsDir, `${versionedName}.min.js`);

const stripBlockComments = (source) => source.replace(/\/\*([\s\S]*?)\*\//g, "");

const concatFiles = async (files) => {
  const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
  return contents.map(stripBlockComments).join("\n");
};

await mkdir(distCssDir, { recursive: true });
await mkdir(distJsDir, { recursive: true });

const jsSource = await concatFiles([
  "src/js/flip.js",
  "src/js/flip.basic.js",
  "src/js/flip.draggable.js",
  "src/js/flip.page.js",
]);

const cssSource = await concatFiles(["src/css/flip.css"]);

await writeFile(devJs, `${banner}${jsSource}\n`);
await writeFile(devCss, `${banner}${cssSource}\n`);

const minified = await Bun.build({
  entrypoints: [devJs],
  minify: {
    syntax: true,
    whitespace: true,
    identifiers: false,
  },
  target: "browser",
  format: "iife",
  write: false,
});

if (!minified.success || !minified.outputs[0]) {
  for (const log of minified.logs) {
    console.error(log);
  }
  process.exit(1);
}

const minifiedJs = await minified.outputs[0].text();
await writeFile(minJs, `${minifiedJs}\n`);

console.log(`Built:\n - ${devCss}\n - ${devJs}\n - ${minJs}`);
