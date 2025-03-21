export const formatPrice = (price: number): string => {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
};

export const formatSchedule = (schedule: string): string => {
  // Schedule is already in the format "Month Day - Month Day • HH:MM-HH:MM"
  return schedule;
}; 