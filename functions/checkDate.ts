export function isDateWithin5Days(dateToCheck: Date): boolean {
    // Get the current date
    const currentDate: Date = new Date();
    // Calculate the difference in milliseconds
    const timeDifference: number = dateToCheck.getTime() - currentDate.getTime();
    // Convert milliseconds to days
    const daysDifference: number = Math.abs(timeDifference / (1000 * 60 * 60 * 24));
    // Check if it's within 5 days
    return daysDifference <= 5;
  }
  