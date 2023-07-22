import chalk from "chalk"
import figlet from "figlet"
import fs from "fs"
import path from "path"
import crypto from "crypto"
import { type } from "os"
export type DirectoryEntry = {
  name: string,
  size: number,
  creationDate: Date,
  isDirectory: boolean
} 

export type Dupes = {
  [hash:string]:string[]
}

export function makeHash(name: string): string {
  const content = fs.readFileSync(name);
  const hash = crypto.createHash('sha256')
  hash.update(content)
  const digest = hash.digest('hex');
  return digest
}

export function listDirContentsSync(filepath: string, duplicates: Dupes) {
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

    /// Checking if it is a dir
    if (dirEntry.isDirectory) {
      // Performing dir actions
      listDirContentsSync(dirEntry.name, duplicates)
    } else {
      // Performing file actions
      const fileHash = makeHash(dirEntry.name)
      if (duplicates[fileHash]) {
        duplicates[fileHash].push(dirEntry.name)
      } else {
        duplicates[fileHash] = [];
        duplicates[fileHash].push(dirEntry.name)
      }
      console.log(
        chalk.green(
          dirEntry.name
        ), `Hash: ${fileHash}`)
    }
  } 
}

