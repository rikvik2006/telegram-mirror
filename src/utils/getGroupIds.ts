import { TelegramClient } from "telegram";

export const getGroupIds = async (
    client: TelegramClient,
    groupsNames: string[]
) => {
    const dialogs = await client.getDialogs();
    const dialogsArray = [...dialogs];

    for (const groupName of groupsNames) {
        dialogsArray.forEach((dialog) => {
            let publicName =
                dialog.entity && "username" in dialog.entity
                    ? dialog.entity.username
                    : undefined;

            if (groupName !== publicName) {
                return;
            }

            publicName = publicName || "N/A";

            console.log(
                "📝",
                `Public Name: ${publicName}, Display Name: ${
                    dialog.name
                }, ID: ${dialog.id?.toString()}`
            );
        });
    }

    // const groupIds = dialogsArray
    //     .filter((dialog) => {
    //         return groupsNames.includes(dialog.title);
    //     })
    //     .map((dialog) => {
    //         return dialog.id;
    //     });

    // // const groupIds = dialogs.chats.map((chat) => {
    // //     return chat.id;
    // // });
    // return groupIds;
};
