export const formatPrice = (price: number): string => {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
};

export const formatSchedule = (schedule: string): string => {
  // If the schedule is already formatted, return it as is
  if (schedule.includes('•')) {
    return schedule;
  }

  // Try to parse the schedule string
  // Expected format: "Nov 25 - Jan 5 • 5-10pm"
  try {
    const [dates, times] = schedule.split(' • ');
    if (dates && times) {
      return schedule;
    }

    // If the schedule is just a simple string, return it as is
    return schedule;
  } catch (error) {
    // If there's any error parsing, return the original string
    return schedule;
  }
}; 