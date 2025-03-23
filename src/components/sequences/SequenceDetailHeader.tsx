
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SequenceBreadcrumbs from '@/components/sequences/SequenceBreadcrumbs';

interface SequenceDetailHeaderProps {
  title: string;
  id?: string;
}

const SequenceDetailHeader: React.FC<SequenceDetailHeaderProps> = ({ title, id }) => {
  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="text-xl mb-4">Sequence not found</div>
        <Link to="/">
          <Button className="mt-4">
            <ArrowLeft className="mr-2" size={16} />
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return <SequenceBreadcrumbs title={title} />;
};

export default SequenceDetailHeader;
