import { Api } from "telegram";
import { checkChatId } from "../functions/checkChatId";

const messageHandler = async (message: Api.Message) => {
    let messagePeerId: string = "";

    if (message.peerId.className === "PeerChat") {
        // Chat
        messagePeerId = message.peerId.chatId.toString();
    } else if (message.peerId.className === "PeerUser") {
        // User
        messagePeerId = message.peerId.userId.toString();
    } else {
        // Channel
        messagePeerId = message.peerId.channelId.toString();
    }

    const isResourceFound = checkChatId(messagePeerId);
    if (!isResourceFound) {
        console.log("Resource not found");
        return;
    }
};

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
