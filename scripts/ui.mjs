import { constants } from "node:fs";
import { access, copyFile, mkdir, readFile, unlink } from "node:fs/promises";
import path from "node:path";

const catalog = JSON.parse(await readFile(new URL("../registry/catalog.json", import.meta.url), "utf8"));
const [command, ...args] = process.argv.slice(2);

function help() {
  console.log(`Neonix UI

  npm run ui -- list [--style <style>]
  npm run ui -- add <component> [--style <style>] [--path components/ui]
  npm run ui -- tokens [--style <style>] [--path app]`);
}

function readOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const [flag, value] = args.slice(index, index + 2);
    if (!["--style", "--path"].includes(flag) || !value || value.startsWith("--") || flag in options) {
      throw new Error(`Invalid option: ${flag}`);
    }
    options[flag] = value;
  }
  return options;
}

async function install(style, files, directory) {
  if (path.isAbsolute(directory) || directory.split(/[\\/]/).includes("..")) {
    throw new Error("--path must be relative to the current project.");
  }
  const destination = path.resolve(directory);
  const targets = files.map(({ source, name = source }) => ({
    source: new URL(`../registry/styles/${style}/${source}`, import.meta.url),
    target: path.join(destination, name),
  }));
  for (const { target } of targets) {
    const exists = await access(target).then(() => true, (error) => {
      if (error.code !== "ENOENT") throw error;
      return false;
    });
    if (exists) throw new Error(`File already exists: ${path.relative(process.cwd(), target)}`);
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

async function run() {
  if (!command || command === "--help" || command === "-h") {
    help();
    return;
  }
  if (!["list", "add", "tokens"].includes(command)) throw new Error(`Unknown command: ${command}`);
  const [name, ...addOptions] = args;
  const options = readOptions(command === "add" ? addOptions : args);
  const style = options["--style"] ?? catalog.defaultStyle;
  if (!catalog.styles.some((item) => item.name === style)) {
    throw new Error(`Unknown style: ${style}`);
  }
  if (command === "list") {
    if (options["--path"]) throw new Error("--path is only available with add and tokens.");
    console.log(`Styles: ${catalog.styles.map((item) => item.name).join(", ")}\nComponents (${style}):`);
    for (const item of catalog.components) console.log(`  ${item.name.padEnd(10)} ${item.description}`);
    return;
  }
  if (command === "tokens") {
    const file = `neonix-${style}.css`;
    await install(style, [{ source: "globals.css", name: file }], options["--path"] ?? "app");
    console.log(`Import ${file} from your root layout and set data-neo-style="${style}" plus data-theme="light" or "dark" on <html> or a wrapper.`);
    return;
  }
  const component = catalog.components.find((item) => item.name === name);
  if (!component) throw new Error(name ? `Unknown component: ${name}` : "Specify a component. Run list to see what's available.");
  await install(style, component.files.map((source) => ({ source })), options["--path"] ?? "components/ui");
  console.log(`Use the ${style} tokens alongside this component.`);
}

try {
  await run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
