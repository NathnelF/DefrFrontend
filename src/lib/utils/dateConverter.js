export function convertDate(date) {
    const newDate = new Date(date);
    const readable = newDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    console.log(readable);
    return readable;
}