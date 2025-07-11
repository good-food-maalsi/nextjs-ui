import { cn } from "@/lib/utils";

type TextCellProps = {
  label: string;
  className?: string;
};

const TextCell = ({ label, className }: TextCellProps) => {
  return <div className={cn("max-w-[200px]", className)}>{label}</div>;
};

export default TextCell;
