import { promises as fs } from "fs";

/**
 * FileHandler provides thin wrappers around fs operations to ease mocking.
 */
class FileHandler {
  /**
   * Reads a file as UTF-8 text.
   */
  public async readFile(path: string): Promise<string> {
    return fs.readFile(path, "utf-8");
  }

  /**
   * Writes text content to the given file path.
   */
  public async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content, "utf-8");
  }
}

export const fileHandler = new FileHandler();

export type FileHandlerType = FileHandler;
