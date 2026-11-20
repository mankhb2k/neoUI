#!/usr/bin/env node

import { constants } from "node:fs";
import { access, copyFile, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const registryUrl = new URL("../registry/catalog.json", import.meta.url);
const catalog = JSON.parse(await readFile(registryUrl, "utf8"));
const [command, ...args] = process.argv.slice(2);
const styleAliases = new Map([
  ["premium", "obsidian"],
  ["obsidian", "obsidian"],
  ["minimal", "minimal"],
]);

function showHelp() {
  console.log(`Neonix UI

  npx --yes --package=github:mankhb2k/neoUI neonix init [--style premium|minimal] [--mode light|dark]
  npx --yes --package=github:mankhb2k/neoUI neonix add <component|--all> [--style premium|minimal]
  npx --yes --package=github:mankhb2k/neoUI neonix list`);
}

function readOptions(values, allowedFlags) {
  const options = {};
  for (let index = 0; index < values.length; index += 1) {
    const flag = values[index];
    if (!allowedFlags.includes(flag) || flag in options) {
      throw new Error(`Invalid option: ${flag}`);
    }
    if (flag === "--all") {
      options[flag] = true;
      continue;
    }
    const value = values[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${flag}`);
    options[flag] = value;
    index += 1;
  }
  return options;
}

function resolveStyle(value = "premium") {
  const name = styleAliases.get(value.toLowerCase());
  if (!name) throw new Error(`Unknown style: ${value}. Choose premium or minimal.`);
  return name;
}

async function resolveAppDirectory(option) {
  const sourceApp = path.join(process.cwd(), "src", "app");
  const defaultApp = path.join(process.cwd(), "app");
  const directory = option ?? (await pathExists(sourceApp) ? "src/app" : "app");
  if (path.isAbsolute(directory) || directory.split(/[\\/]/).includes("..")) {
    throw new Error("--app-dir must be a relative directory inside the current project.");
  }
  return path.resolve(directory);
}

async function pathExists(target) {
  return access(target).then(() => true, (error) => {
    if (error.code !== "ENOENT") throw error;
    return false;
  });
}

function createProjectTokens(style, defaultMode) {
  const tokenUrl = new URL(`../registry/styles/${style}/globals.css`, import.meta.url);
  const defaultSelector = defaultMode === "dark"
    ? ':root:not([data-theme]), :root[data-theme="dark"]'
    : ':root:not([data-theme]), :root[data-theme="light"]';
  return readFile(tokenUrl, "utf8").then((source) => source
    .replace(/\[data-neo-style="[^"]+"\]\[data-theme="light"\]/g,
      defaultMode === "light" ? defaultSelector : ':root[data-theme="light"]')
    .replace(/\[data-neo-style="[^"]+"\]\[data-theme="dark"\]/g,
      defaultMode === "dark" ? defaultSelector : ':root[data-theme="dark"]'));
}

async function init(options) {
  const style = resolveStyle(options["--style"]);
  const mode = options["--mode"] ?? "dark";
  if (!catalog.styles.some((item) => item.name === style)) throw new Error(`Unknown style: ${style}`);
  if (!catalog.styles.find((item) => item.name === style).modes.includes(mode)) {
    throw new Error("--mode must be light or dark.");
  }

  const appDirectory = await resolveAppDirectory(options["--app-dir"]);
  const globalsFile = path.join(appDirectory, "globals.css");
  const componentDirectory = path.resolve("components/ui");
  const projectConfig = path.resolve("neonix.json");

  await mkdir(appDirectory, { recursive: true });
  await mkdir(componentDirectory, { recursive: true });
  await writeFile(globalsFile, await createProjectTokens(style, mode), "utf8");
  await writeFile(projectConfig, `${JSON.stringify({ style, mode }, null, 2)}\n`, "utf8");

  console.log(`Initialized ${catalog.styles.find((item) => item.name === style).label} (${mode}).`);
  console.log(`Replaced ${path.relative(process.cwd(), globalsFile)} with the selected theme tokens.`);
  console.log(`Created ${path.relative(process.cwd(), componentDirectory)}.`);
  console.log("Use data-theme=\"light\" or data-theme=\"dark\" on <html> to switch token modes.");
}

async function installFiles(files, destination) {
  const targets = files.map((file) => ({
    source: new URL(`../registry/styles/${file.style}/${file.name}`, import.meta.url),
    target: path.join(destination, file.name),
  }));

  for (const { target } of targets) {
    if (await pathExists(target)) {
      throw new Error(`File already exists: ${path.relative(process.cwd(), target)}`);
    }
  }

  await mkdir(destination, { recursive: true });
  const installed = [];
  try {
    for (const { source, target } of targets) {
      await copyFile(source, target, constants.COPYFILE_EXCL);
      installed.push(target);
    }
  } catch (error) {
    await Promise.allSettled(installed.map((target) => unlink(target)));
    throw error;
  }

  for (const target of installed) console.log(`Added ${path.relative(process.cwd(), target)}`);
}

async function addComponent(name, options) {
  const configPath = path.resolve("neonix.json");
  const projectConfig = await pathExists(configPath)
    ? JSON.parse(await readFile(configPath, "utf8"))
    : {};
  const style = resolveStyle(options["--style"] ?? projectConfig.style ?? "premium");
  const selected = options["--all"]
    ? catalog.components
    : catalog.components.filter((component) => component.name === name);

  if (!selected.length) {
    throw new Error(name ? `Unknown component: ${name}. Run neonix list to see available components.` : "Choose a component or use --all.");
  }

  await installFiles(
    selected.flatMap((component) => component.files.map((file) => ({ style, name: file }))),
    path.resolve("components/ui"),
  );
}

async function run() {
  if (!command || command === "--help" || command === "-h") {
    showHelp();
    return;
  }

  if (command === "list") {
    console.log("Styles: premium, minimal\nComponents:");
    for (const component of catalog.components) {
      console.log(`  ${component.name.padEnd(10)} ${component.description}`);
    }
    return;
  }

  if (command === "init") {
    await init(readOptions(args, ["--style", "--mode", "--app-dir"]));
    return;
  }

  if (command === "add") {
    const isAddingAll = args[0] === "--all";
    const [name, ...optionArgs] = isAddingAll ? [undefined, ...args] : args;
    const options = readOptions(optionArgs, ["--style", "--all"]);
    if (isAddingAll) options["--all"] = true;
    await addComponent(name, options);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

try {
  await run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
