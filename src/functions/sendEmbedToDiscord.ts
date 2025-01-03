import path from "path";
import { AttachmentBuilder, EmbedBuilder, WebhookClient } from "discord.js";
import { saveImageToFile } from "./temp";
import { logWithTimestamp } from "../utils/log";
import { openJsonFile } from "./openJsonFile";

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

    const jsonData = openJsonFile(
        path.join(__dirname, "..", "..", "config", "embed.json")
    ) as { [key: string]: object | string };

    // Check if exists
    if (!jsonData) {
        logWithTimestamp("❌ Error reading embed.json");
        throw new Error("Error reading embed.json");
    }

    const footerData = jsonData.footer as
        | { text: string; iconURL: string }
        | undefined;

    if (!footerData) {
        logWithTimestamp("❌ jsonData.footer is not defined");
        throw new Error("jsonData.footer is not defined");
    }

    if (footerData.text !== "") {
        embed.setFooter({ text: footerData.text });

        if (footerData.iconURL !== "") {
            embed.setFooter({
                text: footerData.text,
                iconURL: footerData.iconURL,
            });
        }
    }

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
