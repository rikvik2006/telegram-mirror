import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { input } from "@inquirer/prompts";
import { config } from "dotenv";
import { betterConsoleLog } from "telegram/Helpers";
import { checkChatId } from "./functions/checkChatId";
import { logWithTimestamp } from "./utils/log";
import { messageHandler } from "./services/mesageHandler";
import { getOutWebhokByChatId } from "./functions/getOutWebhookByChatId";
config();

const apiId = parseInt(process.env.API_ID as string);
const apiHash = process.env.API_HASH as string;
const stringSession = new StringSession(process.env.SESSION_STRING);

const startTelegramClient = async () => {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    // Client Login
    await client.start({
        phoneNumber: async () => await input({ message: "Phone Number" }),
        // password: async () => await input({ message: "Password" }),
        phoneCode: async () => await input({ message: "Code" }),
        onError: (err) => console.log(err),
    });
    logWithTimestamp("🔗 Connected");

    // Listener for new messages
    client.addEventHandler(async (update: NewMessageEvent) => {
        console.log(update);
        const message = update.message;

        // Chat ID
        const chatId = update.chatId?.toString();
        logWithTimestamp("🆔 Chat Id:", chatId);
        if (!chatId) {
            console.log("❌ Chat ID not found");
            return;
        }

        const isChatIdFound = checkChatId(chatId);
        if (!isChatIdFound) return;

        // Out webhook from config/channelsToWebhook.json
        const outWebhook = getOutWebhokByChatId(chatId);
        if (!outWebhook) {
            logWithTimestamp("❌ Out webhook not found but chatId is found");
            throw new Error("Out webhook not found but chatId is found");
        }

        if (!message || !message.message) return;
        await messageHandler(message, outWebhook);
    }, new NewMessage({}));

    await client.connect();
};

startTelegramClient();
