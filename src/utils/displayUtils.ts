
export const formatSchedule = (schedule: any): string => {
  if (!schedule) return 'Schedule not available';
  
  const startDate = new Date(schedule.start_date);
  const endDate = new Date(schedule.end_date);
  
  const startMonth = startDate.toLocaleString('default', { month: 'short' });
  const endMonth = endDate.toLocaleString('default', { month: 'short' });
  
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  
  const hours = schedule.hours 
    ? `${schedule.hours.start.substring(0, 5)}-${schedule.hours.end.substring(0, 5)}` 
    : '';
  
  return `${startMonth} ${startDay} - ${endMonth} ${endDay} • ${hours}`;
};
