// Send a buffer as an embed image

import fs from "fs";
import { WebhookClient, AttachmentBuilder, EmbedBuilder } from "discord.js";
import path from "path";

const webhookClient = new WebhookClient({
    url: "https://discord.com/api/webhooks/1312923729776349288/lXJvwjuzEbAEkpbUJxJbD8-R1Imi5R7eSvk6wwLm2HH2mnJeuxROfdBRiN83lSF4RWOj",
});

const imagePath = path.join(__dirname, "..", "..", "temp", "beanz.png");
const imageBuffer = fs.readFileSync(imagePath);

// delete the file imagePath
// fs.unlinkSync(imagePath);

const attachment = new AttachmentBuilder(imageBuffer, { name: "beanz.png" });

const embed = new EmbedBuilder()
    .setTitle("Beanz")
    .setDescription("This is a test message")
    // .setThumbnail("attachment://beanz.png")
    .setImage("attachment://beanz.png")
    .setAuthor({
        name: "Vecio",
        iconURL:
            "https://cdn.discordapp.com/emojis/1149678631078076466.webp?size=96&animated=true",
    });

webhookClient.send({ embeds: [embed], files: [attachment] });
