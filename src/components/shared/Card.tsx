import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-md p-6',
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow duration-150',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
