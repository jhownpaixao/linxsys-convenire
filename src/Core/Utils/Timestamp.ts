export function DateDifference(date1: Date, date2: Date, type = 'd') {
    let difference = date1.getTime() - date2.getTime();

    const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24;

    const hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60;

    const minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    const secondsDifference = Math.floor(difference / 1000);

    switch (type) {
        case 'd':
            return daysDifference;
            break;

        case 'h':
            return hoursDifference;
            break;

        case 'm':
            return minutesDifference;
            break;

        case 's':
            return secondsDifference;
            break;

        default:
            return daysDifference;
            break;
    }
}

export function TimestampDifference(timestamp1: number, timestamp2: number, type = 'd') {
    const difference = timestamp1 - timestamp2;
    let dvrs;
    switch (type) {
        case 'd':
            dvrs = difference / 1000 / 60 / 60 / 24;
            break;

        case 'h':
            dvrs = difference / 1000 / 60 / 60;
            break;

        case 'm':
            dvrs = difference / 1000 / 60;
            break;

        case 's':
            dvrs = difference / 1000;
            break;

        default:
            dvrs = difference / 1000 / 60 / 60 / 24;
            break;
    }
    return Math.round(dvrs * -1 * 100) / 100;
}
