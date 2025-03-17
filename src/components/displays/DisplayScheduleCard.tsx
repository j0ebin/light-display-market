
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface ScheduleType {
  start_date: string;
  end_date: string;
  days: string[];
  hours: {
    start: string;
    end: string;
  };
}

interface DisplayScheduleCardProps {
  schedule: ScheduleType | null;
}

const DisplayScheduleCard: React.FC<DisplayScheduleCardProps> = ({ schedule }) => {
  const formatSchedule = (schedule: ScheduleType | null): string => {
    if (!schedule) return 'Schedule not available';
    
    const startDate = new Date(schedule.start_date);
    const endDate = new Date(schedule.end_date);
    
    const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const formatHours = (schedule: ScheduleType | null): string => {
    if (!schedule || !schedule.hours) return 'Hours not available';
    
    return `${schedule.hours.start.substring(0, 5)} - ${schedule.hours.end.substring(0, 5)}`;
  };

  const formatDays = (schedule: ScheduleType | null): string => {
    if (!schedule || !schedule.days || schedule.days.length === 0) return 'Days not available';
    
    if (schedule.days.length === 7) {
      return 'Every day';
    }
    
    return schedule.days.join(', ');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2" size={18} />
          Viewing Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Dates</div>
            <div className="font-medium">{formatSchedule(schedule)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Days</div>
            <div className="font-medium">{formatDays(schedule)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Hours</div>
            <div className="font-medium">{formatHours(schedule)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayScheduleCard;
