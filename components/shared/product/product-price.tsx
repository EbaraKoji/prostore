import { cn } from '@/lib/utils';

interface Props {
  value: string;
  className?: string;
}

export const ProductPrice = ({ value, className }: Props) => {
  const [intValue, floatValue] = value.split('.');
  return (
    <p className={cn('text-2xl', className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
};
