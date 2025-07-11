"use client";

import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerWithRangeProps = {
  className?: string;
  onSelect?: (date: DateRange | undefined) => void;
  defaultDateRange?: DateRange;
};

export function DatePickerWithRange({
  className,
  onSelect,
  defaultDateRange = { from: subDays(new Date(), 20), to: new Date() },
}: DatePickerWithRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>(defaultDateRange);

  const handleSelect = (date: DateRange | undefined) => {
    setDate(date);
    if (onSelect) onSelect(date);
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "max-w-[350px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "PPP", { locale: fr })} -{" "}
                  {format(date.to, "PPP", { locale: fr })}
                </>
              ) : (
                format(date.from, "PPP", { locale: fr })
              )
            ) : (
              <span>Sélectionner une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
