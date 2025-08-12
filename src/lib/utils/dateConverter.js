export function readableDate(date) {
    //Converts date in ISO string format to prettier, more human readable format
    const newDate = new Date(date);
    const readable = newDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    return readable;
}

export function IsoDate(date) { 
    //parses date string into ISO format to be sent to server.
    const newDate = new Date(date);
    if (isNaN(newDate)) {
        console.log("Error in date format")
        throw new Error('Invalid date format!')
    }

    const IsoDate = newDate.toISOString().slice(0,19);
    console.log(`Converted ${date} to ${IsoDate}`)
    return IsoDate;
}
