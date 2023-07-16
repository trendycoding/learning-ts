import chalk from "chalk"
import figlet from "figlet"
import fs from "fs"
import path from "path"
export type DirectoryEntry = {
  name: string,
  size: number,
  creationDate: Date,
  isDirectory: boolean
} 


export function listDirContentsSync(filepath: string) {
  const filenames = fs.readdirSync(filepath)

  for (let fileIndex = 0; fileIndex < filenames.length; fileIndex++) {
    const currentFile = filenames[fileIndex]
    const resolvePath = path.resolve(filepath, currentFile)
    const dirEntryInfo = fs.lstatSync(resolvePath)
    const dirEntry: DirectoryEntry = {
      name: resolvePath,
      size: dirEntryInfo.size,
      creationDate: dirEntryInfo.birthtime,
      isDirectory: dirEntryInfo.isDirectory()
    }
    if (dirEntry.isDirectory) {
      console.log(
        chalk.blue(
          dirEntry.name
        )
      );
    } else {
      console.log(
        chalk.green(
          dirEntry.name
        ))
    }
  }
}