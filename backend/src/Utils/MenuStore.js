
import { readFile, writeFile } from "fs/promises";
import path from "path";

const filePath = path.resolve("./src/Db/menuData.json");

export async function getMenu() {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function saveMenu(menu) {
    await writeFile(
        filePath,
        JSON.stringify(menu, null, 2)
    );
}
