
import React from 'react';
import { Link } from 'react-router-dom';

interface DisplayBreadcrumbsProps {
  displayName: string;
}

const DisplayBreadcrumbs: React.FC<DisplayBreadcrumbsProps> = ({ displayName }) => {
  return (
    <div className="flex items-center mb-8 text-sm">
      <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
        Home
      </Link>
      <span className="mx-2 text-muted-foreground">/</span>
      <Link to="/displays" className="text-muted-foreground hover:text-foreground transition-colors">
        Displays
      </Link>
      <span className="mx-2 text-muted-foreground">/</span>
      <span className="font-medium truncate">{displayName}</span>
    </div>
  );
};

export default DisplayBreadcrumbs;
