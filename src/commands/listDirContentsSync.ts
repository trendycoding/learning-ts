import fs from "fs"

export function listDirContentsSync(filepath: string) {
  const filenames = fs.readdirSync(filepath)

  for (let fileIndex = 0; fileIndex < filenames.length; fileIndex++) {
    console.log(`${fileIndex + 1} ${filenames[fileIndex]}`)
  }
}