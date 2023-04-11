

export function DateDifference(date1: Date, date2: Date, type: string = 'd') {
    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60

    var secondsDifference = Math.floor(difference / 1000);

    switch (type) {
        case 'd':
            return daysDifference
            break;

        case 'h':
            return hoursDifference
            break;

        case 'm':
            return minutesDifference
            break;

        case 's':
            return secondsDifference
            break;

        default:
            return daysDifference
            break;
    }
}

export function TimestampDifference(timestamp1: number, timestamp2: number, type: string = 'd') {
    let difference = timestamp1 - timestamp2;
    let dvrs;
    switch (type) {
        case 'd':
            dvrs = difference / 1000 / 60 / 60 / 24
            break;

        case 'h':
            dvrs = difference / 1000 / 60 / 60
            break;

        case 'm':
            dvrs = difference / 1000 / 60
            break;

        case 's':
            dvrs = difference / 1000
            break;

        default:
            dvrs = difference / 1000 / 60 / 60 / 24
            break;
    }
    return Math.round((dvrs * -1) * 100) / 100
}