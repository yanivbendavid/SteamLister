const { readdirSync, readFileSync } = require("fs");
const steamBaseDir = `c:/Program files (x86)/Steam`;


const libraryReader = (path) =>
    readdirSync(`${path}/steamapps/common`, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const gameListReader = () => {
  const baseList = libraryReader(steamBaseDir);
  const libraryfoldersFile = require("@node-steam/vdf").parse(
        readFileSync(`${steamBaseDir}/steamapps/libraryfolders.vdf`, "utf8")
  );
  console.log(libraryfoldersFile);
  if (Object.keys(libraryfoldersFile).includes("LibraryFolders")) {
    return [
      ...baseList,
      ...Object.values(libraryfoldersFile.LibraryFolders)
        .filter((i) => i.includes("\\"))
        .map((library) => libraryReader(library.replaceAll("\\","/"))),
    ];
  }
  return baseList;
};

typeof require !== "undefined" && require.main === module && console.log(gameListReader());