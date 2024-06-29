const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getDisplayDate(isoDate: string): string {
    const date = new Date(isoDate);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
  }
