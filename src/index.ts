import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { resolveId } from "telegram/Utils";
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

        /*
         * Telegram ID Explained
         *
         * Chats: Chats are what offcial applications refer as groups. Both the bot API and Telethon (actualy GramJS) will add a minus sign (negate) the real chat ID so that you can tell at a glance, with just a number, the entity type.
         *
         * See Telethon Documentation: https://docs.telethon.dev/en/stable/concepts/chats-vs-channels.html#chats
         *
         * Channels: Official applications create a broadcast channel when you create a new channel (used to broadcast messages, only administrators can post messages).
         *
         * Both the bot API and Telethon will “concatenate” -100 to the real chat ID so you can tell at a glance, with just a number, the entity type.
         *
         * See Telethon Documentation: https://docs.telethon.dev/en/stable/concepts/chats-vs-channels.html#channels
         */

        // Chat ID
        const chatId = update.chatId?.toString();
        logWithTimestamp("🆔 Chat Id:", chatId);
        if (!chatId) {
            console.log("❌ Chat ID not found");
            return;
        }

        const [realId, peerType] = resolveId(update.chatId!);

        console.log("🆔 Real Id:", realId);
        console.log("🆔 Peer Type:", peerType);

        const isChatIdFound = checkChatId(chatId);
        if (!isChatIdFound) return;

        // Out webhook from config/channelsToWebhook.json
        const outWebhook = getOutWebhokByChatId(chatId);
        if (!outWebhook) {
            logWithTimestamp("❌ Out webhook not found but chatId is found");
            throw new Error("Out webhook not found but chatId is found");
        }

        if (!message || !message.message) return;
        await messageHandler(update, message, outWebhook);
    }, new NewMessage({}));

    await client.connect();
};

startTelegramClient();
