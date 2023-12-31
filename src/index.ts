#!/usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import path from "path";
import {Command} from "commander";
import fs from "fs"
import { listDirContentsSync } from "./commands/listDirContentsSync";

// Chalk: Makes CLI asthetic
// Figlet: Makes CLI asthetic
// Clear: Clears command line every time it runs
// Path: Allows you to specify a path
// Command: Gives you the ability to use command line syntax [in your CLI]

clear();
console.log(
  chalk.blue(
    figlet.textSync('DIR MANAGER. By David', { horizontalLayout: 'full' })
  )
);

const program = new Command()

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .option("-l, --ls  [value]", "List directory contents")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);


  const options = program.opts();

  async function listDirContents(filepath: string) {
    try {
      const files = await fs.promises.readdir(filepath);
      const detailedFilesPromises = files.map(async (file: string) => {
        let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
        const { size, birthtime } = fileDetails;
        return { filename: file, "size(KB)": size, created_at: birthtime };
      });

      const detailedFiles = await Promise.all(detailedFilesPromises);
      console.table(detailedFiles);
    } catch (error) {
      console.error("Error occurred while reading the directory!", error);
    }
  }



function createDir(filepath: string) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
    console.log("The directory has been created successfully");
  }
}  

function createFile(filepath: string) {
  fs.openSync(filepath, "w");
  console.log("An empty file has been created");
}

if (options.ls) {
  const filepath = typeof options.ls === "string" ? options.ls : __dirname;
  //listDirContents(filepath);
  listDirContentsSync(filepath)
}

if (options.mkdir) {
  createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
  createFile(path.resolve(__dirname, options.touch));
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
