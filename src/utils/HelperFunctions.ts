import { formatDistanceToNow } from "date-fns";

export const convertToRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const relativeTime = formatDistanceToNow(date, { addSuffix: false });

    const match = relativeTime.match(/(\d+) (\w+)/);
    if (match) {
        const [_, number, unit] = match;
        const modifiedUnit = Number(number) < 0 ? unit.replace(/s$/, '') : unit; 
        return `${number} ${modifiedUnit} ago`; 
    }

    return relativeTime + ' ago'; 
};