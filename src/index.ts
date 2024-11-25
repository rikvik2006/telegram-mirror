import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { input } from "@inquirer/prompts";
import { config } from "dotenv";
import { betterConsoleLog } from "telegram/Helpers";
import { checkChatId } from "./functions/checkChatId";
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
    console.log("Connected");

    // Listener for new messages
    client.addEventHandler(async (update: NewMessageEvent) => {
        console.log(update);
        const message = update.message;

        // Chat ID
        const chatId = update.chatId?.toString();
        console.log("🆔 Chat Id:", chatId);
        if (!chatId) {
            console.log("❌ Chat ID not found");
            return;
        }

        const isChatIdFound = checkChatId(chatId);
        if (!isChatIdFound) return;

        if (!message || !message.message) return;
        console.log("---------- Nuovo Messaggio ----------");
        console.log("⭐", message.message);
        const mediaBuffer = message.media?.getBytes();
        // client.sendMessage();
    }, new NewMessage({}));

    await client.connect();
};

startTelegramClient();
