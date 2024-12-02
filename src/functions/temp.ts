import fs from "fs";

export const saveImageToFile = (
    buffer: Buffer,
    fileName: string
): Promise<string | unknown> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, buffer, (err) => {
            if (err) reject(err);
            else resolve(fileName);
        });
    });
};
