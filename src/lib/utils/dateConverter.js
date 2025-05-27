export function readableDate(date) {
    const newDate = new Date(date);
    const readable = newDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    return readable;
}

export function IsoDate(date) { 
    const newDate = new Date(date);
    if (isNaN(newDate)) {
        throw new Error('Invalid date format!, please use: Month day, Year')
    }

    const IsoDate = newDate.toISOString().slice(0,19);
    console.log(`Converted ${date} to ${IsoDate}`)
    return IsoDate;
}