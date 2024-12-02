import path from "path";
import { openJsonFile } from "./openJsonFile";

export const getOutWebhokByChatId = (chatId: string): string | undefined => {
    const jsonData = openJsonFile(
        path.join(__dirname, "..", "..", "config", "channelsToWebhook.json")
    ) as { [key: string]: string };

    const objectKeys = Object.keys(jsonData);

    for (const key of objectKeys) {
        if (key === chatId) {
            return jsonData[key];
        }
    }
};
