import { Api, utils } from "telegram";
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
import { _updateLoop } from "telegram/client/updates";

export const messageHandler = async (
    update: NewMessageEvent,
    message: Api.Message,
    outWebhook: string
) => {
    logWithTimestamp("---------- Nuovo Messaggio ----------");
    logWithTimestamp("⭐", message.message);

    if (!update.client) {
        logWithTimestamp("❌ Client not found");
        throw new Error("Client not found");
    }

    // const entity = await update.getChat();

    // if (!entity) {
    //     logWithTimestamp(
    //         "❌ Entity not found (the message is not in a chat or a channel)"
    //     );
    //     throw new Error(
    //         "Entity not found (the message is not in a chat or a channel)"
    //     );
    // }

    // const entityName = utils.getDisplayName(entity);
    const messageContent: string = message.message;
    // Get the image from the message if it exists
    let messageImage: string | Buffer | undefined = undefined;
    if (update.message.media) {
        if (update.message.media.className === "MessageMediaPhoto") {
            const photo = update.message.media.photo;
            if (photo) {
                if (photo.className === "Photo") {
                    const downloadedImage = await update.client.downloadMedia(
                        update.message
                    );

                    if (downloadedImage) {
                        messageImage = downloadedImage;
                    }
                }
            }
        } else if (update.message.media.className === "MessageMediaWebPage") {
            const webPage = update.message.media.webpage;
            if (webPage) {
                if (webPage.className === "WebPage") {
                    if (webPage.photo) {
                        const downloadedImage =
                            await update.client.downloadMedia(update.message);

                        if (downloadedImage) {
                            messageImage = downloadedImage;
                        }
                    }

                    // messageImage = webPage.displayUrl;
                }
            }
        }
    }

    sendEmbedToDiscord(outWebhook, {
        messageContent,
        messageImage,
        author: "test",
    });

    // const telegramMessageLinkRegEx = /https:\/\/t\.me(\/c)?\/([^\/]+)\/(\d+)/g;
    // const telegramMessageLinkMatches = messageContent.matchAll(
    //     telegramMessageLinkRegEx
    // );

    // for (const match of telegramMessageLinkMatches) {
    //     const entityId = match[2];
    //     const messageId = match[3];
    //     console.log("🔗", entityId, messageId);

    //     const entity = await update.client.getEntity(entityId);
    //     utils.getDisplayName();
    // }
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
