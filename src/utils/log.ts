export const logWithTimestamp = (...message: (string | undefined)[]) => {
    const date = new Date();
    const time = date.toLocaleTimeString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    console.log(`[${time}] ${message.join(" ")}`);
};
