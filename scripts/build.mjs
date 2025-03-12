#!/usr/bin/env zx

import "zx/globals";
import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch") || process.argv.includes("-w");

if (watch) {
  console.log('Building in "watch" mode.');
}

let tailwindcss_flags = [
  "-i",
  "./src/css/input.css",
  "-o",
  "./src/css/built.css",
];

if (watch) {
  tailwindcss_flags.push("--watch");
}

const entryPoints = ["src/index.ts"];
const bundle = true;
const outfile = "dist/index.js";
const platform = "node";
const loader = {
  ".css": "text",
};
const logLevel = "info";

let processes = [];

if (!watch) {
  await $`npx xss-scan`;
  await $`npx @tailwindcss/cli ${tailwindcss_flags}`;
  await $`npx tsc --noEmit`;

  await esbuild.build({
    entryPoints,
    bundle,
    outfile,
    platform,
    loader,
    logLevel,
  });
} else {
  processes.push($`npx @tailwindcss/cli ${tailwindcss_flags}`);

  const esbuild_context = await esbuild.context({
    entryPoints,
    bundle,
    outfile,
    platform,
    loader,
    logLevel,
  });

  processes.push(esbuild_context.watch());
}

await Promise.all(processes);
