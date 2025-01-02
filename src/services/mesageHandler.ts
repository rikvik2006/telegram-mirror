import { Api } from "telegram";
import { checkChatId } from "../functions/checkChatId";
import { logWithTimestamp } from "../utils/log";
import {
    EmbedBuilder,
    MessageActivityType,
    WebhookClient,
    Routes,
} from "discord.js";
import { sendEmbedToDiscord } from "../functions/sendEmbedToDiscord";
import { NewMessageEvent } from "telegram/events";

export const messageHandler = async (
    update: NewMessageEvent,
    message: Api.Message,
    outWebhook: string
) => {
    logWithTimestamp("---------- Nuovo Messaggio ----------");
    logWithTimestamp("⭐", message.message);

    const messageContent: string = message.message;
    // Get the image from the message if it exists
    const messageImage = message.photo?.getBytes();
    const messageDocument = message.document?.getBytes();
    const messagePostAuthor = message.postAuthor;

    console.log("📸", messageImage?.toString());

    sendEmbedToDiscord(outWebhook, messageContent, messageImage);
};

// let messagePeerId: string = "";

// if (message.peerId.className === "PeerChat") {
//     // Chat
//     messagePeerId = message.peerId.chatId.toString();
// } else if (message.peerId.className === "PeerUser") {
//     // User
//     messagePeerId = message.peerId.userId.toString();
// } else {
//     // Channel
//     messagePeerId = message.peerId.channelId.toString();
// }

// const isResourceFound = checkChatId(messagePeerId);
// if (!isResourceFound) {
//     console.log("Resource not found");
//     return;
// }

// if (message.peerId.className === "PeerChat") {
//     // Chat
//     console.log("⚙️🗣️ PeerId", message.peerId);
//     console.log("⚙️🗣️ PeerId", message.peerId.chatId.toString());
// } else if (message.peerId.className === "PeerUser") {
//     // User
//     console.log("⚙️👤 PeerId", message.peerId);
//     console.log("⚙️👤 PeerId", message.peerId.userId.toString());
// } else {
//     // Channel

//     /*
//     Proprietà utili:
//     message.postAuthor

//     */
//     message.photo;
//     console.log("⚙️📞 PeerId", message.peerId);
//     console.log("⚙️📞 PeerId", message.peerId.channelId.toString());
// }
