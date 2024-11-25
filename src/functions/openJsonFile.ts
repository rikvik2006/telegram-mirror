import fs from "fs";

export const openJsonFile = (filePath: string) => {
    const data = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(data);

    return jsonData;
};
