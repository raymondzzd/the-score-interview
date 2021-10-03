import moment from 'moment-timezone';

class CustomDateUtils {
  getDateFormatted = (locale: string): string => {
    return moment().locale(locale).format('L');
  };
}

export const DateUtils: CustomDateUtils = new CustomDateUtils();
