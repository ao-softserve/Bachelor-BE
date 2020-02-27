import { readdirSync } from "fs";

export default class DBPathFactory {
  static dbFileRegex = /db_\d{1,2}.json/;
  static dbIndexRegex = /\d{1,2}/;

  constructor(dbDirectory) {
    this.directory = dbDirectory;
  }

  get _dirFiles() {
    return readdirSync(this.directory);
  }

  get _dbFiles() {
    return this._dirFiles.filter(fileName =>
      DBPathFactory.dbFileRegex.test(fileName)
    );
  }

  get _dbFileExists() {
    return !!this._dbFiles.length;
  }

  get _dbFilesIndexes() {
    if (this._dbFileExists) {
      return this._dbFiles.map(file =>
        Number(DBPathFactory.dbIndexRegex.exec(file))
      );
    } else {
      return [0];
    }
  }

  get _highestDbFileIndex() {
    return Math.max(...this._dbFilesIndexes);
  }

  get _newDbFileIndex() {
    return this._highestDbFileIndex + 1;
  }

  get dbFilePath() {
    return `${this.directory}/db_${this._newDbFileIndex}.json`;
  }
}
