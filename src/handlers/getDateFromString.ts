// date format - DD.MM.YYYY HH:mm:ss

const utcOffset = new Date().getTimezoneOffset();

export const getDateFromString = (dateString: string): string => {
    if (!dateString) return null;
    const dateArray = dateString.split(' ');
    const [year, month, day] = dateArray[0].split('-');
    const [hours, minutes, seconds] = dateArray[1].split(':');

    return `${day}.${month}.${year} ${hours}:${minutes}`
};