import path from "path";
import { AttachmentBuilder, EmbedBuilder, WebhookClient } from "discord.js";
import { saveImageToFile } from "./temp";
import { logWithTimestamp } from "../utils/log";

export const sendEmbedToDiscord = async (
    outWebhook: string,
    messageContent: string,
    messageImage?: Buffer
) => {
    const webhookClient = new WebhookClient({ url: outWebhook });
    let attachment: AttachmentBuilder | undefined;
    let attachmentUrl: string | undefined;
    if (messageImage) {
        const tempFileName = path.join(
            __dirname,
            "..",
            "..",
            "temp",
            `temp-${Date.now()}.png`
        );
        await saveImageToFile(messageImage, tempFileName);
        // attachment = new AttachmentBuilder(messageImage);
        attachmentUrl = `attachment://${tempFileName.split("/").pop()}`;
    }

    const embed = new EmbedBuilder({
        description: messageContent,
        ...(attachmentUrl
            ? {
                  thumbnail: { url: attachmentUrl },
                  image: { url: attachmentUrl },
              }
            : {}),
    });

    try {
        await webhookClient.send({
            embeds: [embed],
            // files: attachment ? [attachment] : [],
        });
        logWithTimestamp("🚀 Message sent to Discord");
    } catch (err) {
        logWithTimestamp("❌ Error sending message to Discord");
        console.log(err);
    }
};
