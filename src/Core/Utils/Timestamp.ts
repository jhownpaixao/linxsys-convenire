import moment from 'moment';

export function DateDifference(date1: Date, date2: Date, type?: 'd' | 'h' | 'm' | 's' | 'ms') {
  const a = moment(date1);
  const b = moment(date2);

  switch (type) {
    case 'd':
      return a.diff(b, 'days');
      break;

    case 'h':
      return a.diff(b, 'hours');
      break;

    case 'm':
      return a.diff(b, 'minutes');
      break;

    case 's':
      return a.diff(b, 'seconds');
      break;

    case 'ms':
      return a.diff(b, 'milliseconds');
      break;

    default:
      return a.diff(b, 'days');
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
