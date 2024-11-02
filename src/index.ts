import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { input } from "@inquirer/prompts";
import { config } from "dotenv";
config();

const apiId = parseInt(process.env.API_ID as string);
const apiHash = process.env.API_HASH as string;
const stringSession = new StringSession(process.env.SESSION_STRING);

const startTelegramClient = async () => {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input({ message: "Phone Number" }),
        // password: async () => await input({ message: "Password" }),
        phoneCode: async () => await input({ message: "Code" }),
        onError: (err) => console.log(err),
    });
    console.log("Connected");
    await client.sendMessage("me", { message: "Ciao ⭐" });

    // Listener for new messages
    client.addEventHandler(async (update: NewMessageEvent) => {
        console.log(update);
        const message = update.message;

        if (!message || !message.message) return;
        console.log("🦵 Ciao");
        console.log("⭐", message.message);
    }, new NewMessage({}));

    await client.connect();
};

startTelegramClient();
