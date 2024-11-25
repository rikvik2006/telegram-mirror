import path from "path";
import { openJsonFile } from "./openJsonFile";
import { BinaryReader } from "telegram/extensions";

export const checkChatId = (chatId: string) => {
    const jsonData = openJsonFile(
        path.join(__dirname, "..", "..", "config", "channelsToWebhook.json")
    ) as { [key: string]: string };

    const objectKeys = Object.keys(jsonData);

    let isResourceFound = false;
    for (const key of objectKeys) {
        if (key === chatId) {
            isResourceFound = true;
            break;
        }
    }

    return isResourceFound;
};
