const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getDisplayDate(isoDate: string, addTimeStamp?: boolean): string {
    const date = new Date(isoDate);

    const theDay = getDisplayDay(date)
    const timeStamp = addTimeStamp ? ` at ${date.getHours()}:${date.getMinutes()}` : "";

    return `${theDay}${timeStamp}`;
  }

  const getDisplayDay = (date: Date) => {
    const todaysDate = new Date()
    const hoursAgo = (todaysDate.valueOf() - date.valueOf()) /1000 /60 /60;

    if (hoursAgo < 24) return 'today';
    if (hoursAgo < 48) return 'yesterday';
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }
