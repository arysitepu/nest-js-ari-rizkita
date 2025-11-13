import * as moment from 'moment';
import 'moment/locale/id';

export function getDateNow() {
  const d = new Date();
  const getYear = d.toLocaleString('default', { year: 'numeric' });
  const getMonth = d.toLocaleString('default', { month: '2-digit' });
  const getDay = d.toLocaleString('default', { day: '2-digit' });

  const seconds = d.toLocaleString('default', {
    timeZone: 'Asia/Jakarta',
    second: '2-digit',
  });
  const minutes = d.toLocaleString('default', { minute: '2-digit' });
  const hours = d.toLocaleTimeString('id-ID', {
    hour12: false,
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
  });

  const dateFormat =
    getYear +
    '-' +
    getMonth +
    '-' +
    getDay +
    'T' +
    (hours.length === 1 ? `0${hours}` : hours) +
    ':' +
    (minutes.length === 1 ? `0${minutes}` : minutes) +
    ':' +
    (seconds.length === 1 ? `0${seconds}` : seconds) +
    '.' +
    d.getMilliseconds() +
    'Z';

  return dateFormat;
}

export function formatSelectedDateUtc(date: any) {
  const d = moment(date.replace('Z', '')).format('DD MMMM YYYY HH:mm');

  return d;
}

export function getDateByValue(params: { value: string }) {
  const d = new Date(params.value);
  const getYear = d.toLocaleString('default', { year: 'numeric' });
  const getMonth = d.toLocaleString('default', { month: '2-digit' });
  const getDay = d.toLocaleString('default', { day: '2-digit' });

  const seconds = d.toLocaleString('default', {
    timeZone: 'Asia/Jakarta',
    second: '2-digit',
  });
  const minutes = d.toLocaleString('default', { minute: '2-digit' });
  const hours = d.toLocaleTimeString('id-ID', {
    hour12: false,
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
  });

  const dateFormat =
    getYear +
    '-' +
    getMonth +
    '-' +
    getDay +
    'T' +
    (hours.length === 1 ? `0${hours}` : hours) +
    ':' +
    (minutes.length === 1 ? `0${minutes}` : minutes) +
    ':' +
    (seconds.length === 1 ? `0${seconds}` : seconds) +
    '.' +
    d.getMilliseconds() +
    'Z';

  return dateFormat;
}

export function getValueByTypeName(type: string, value: string) {
  if (['DateTime', 'Date'].includes(type)) {
    return getDateByValue({ value });
  }

  return value;
}

export function isEmpty(param: any) {
  if (typeof param === 'undefined' || param === null) {
    return true;
  }

  if (typeof param === 'object' && Object.keys(param).length === 0) {
    return true;
  }

  if (param instanceof Array && param.length === 0) {
    return true;
  }

  if (typeof param === 'string' && param.trim().length === 0) {
    return true;
  }

  return false;
}

export function getStatusWorkflowApproval(
  value: string | number,
  action: 'string-to-number' | 'number-to-string',
) {
  if (action === 'string-to-number') {
    switch ((value as string).replace(' ', '-').toLowerCase()) {
      case 'approved':
        return 1;
      case 'approve-in-progress':
        return 2;
      case 'draft':
        return 0;
      case 'unblacklist-in-progress':
        return 7;
      case 'blacklist-in-progress':
        return 8;
      case 'blacklisted':
        return 9;
      default:
        return undefined;
    }
  } else {
    switch (value as number) {
      case 1:
        return 'approved';
      case 2:
        return 'approve-in-progress';
      case 0:
        return 'draft';
      case 7:
        return 'unblacklist-in-progress';
      case 8:
        return 'blacklist-in-progress';
      case 9:
        return 'blacklisted';
      default:
        return undefined;
    }
  }
}

export function containsSubstring(input: string, substring: string): boolean {
  const regex = new RegExp(substring);
  return regex.test(input);
}

export function isOverlappingDate<T>(params: {
  checkerData: T[];
  keyChecker: {
    startDate: string;
    endDate: string;
  };
  startDateVal: Date;
  endDateVal: Date;
}) {
  const { checkerData, startDateVal, endDateVal, keyChecker } = params;

  for (const data of checkerData) {
    const startDate = moment(new Date(data[keyChecker.startDate]));
    const endDate = moment(new Date(data[keyChecker.endDate]));

    const startDateValTmp = moment(new Date(startDateVal));
    const endDateValTmp = moment(new Date(endDateVal));

    if (
      startDateValTmp.isSameOrAfter(startDate) &&
      endDateValTmp.isSameOrBefore(endDate)
    ) {
      return true;
    }

    if (
      startDate.isSameOrAfter(startDateValTmp) &&
      endDate.isSameOrBefore(endDateValTmp)
    ) {
      return true;
    }

    if (startDateValTmp.isBetween(startDate, endDate)) {
      return true;
    }

    if (endDateValTmp.isBetween(startDate, endDate)) {
      return true;
    }
  }

  return false;
}

export function capitalizeFirstWord(str) {
  if (!str) {
    return ''; // handles empty strings
  }

  const firstWordEnd = str.indexOf(' ');
  const firstWord = firstWordEnd === -1 ? str : str.substring(0, firstWordEnd);
  const restOfString = firstWordEnd === -1 ? '' : str.substring(firstWordEnd);
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1) + restOfString;
}

export function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes; // Convert to total minutes
}

export function checkOverlapTime(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const s1 = parseTime(start1);
  const e1 = parseTime(end1);
  const s2 = parseTime(start2);
  const e2 = parseTime(end2);

  return s1 < e2 && s2 < e1;
}

export function checkOverlapTimeISO(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();

  return s1 <= e2 && s2 <= e1;
}

export function toISOStringFromHHmm(
  timeStr: string,
  dateStr: string = moment().format('YYYY-MM-DD'),
): string {
  // Optional: you can use today's date dynamically instead
  return `${dateStr}T${timeStr}:00Z`;
}
