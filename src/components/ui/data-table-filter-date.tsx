"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Column, Table } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePickerWithRange } from "./date-picker-with-range";

interface DateFilterValue {
  label: string;
  range: {
    from: string;
    to: string;
  };
}
interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
  table: Table<TData>;
  canMultipleSlection?: boolean;
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
  options,
  canMultipleSlection,
}: DataTableDateFilterProps<TData, TValue>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from?: Date;
    to?: Date;
  } | null>(null);

  const handleCustomOptionClick = () => {
    setIsModalOpen(true);
  };
  const normalizeDate = (date: Date, endOfDay = false) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0); // midnight
    if (endOfDay) {
      normalized.setHours(23, 59, 59, 999);
    }
    return normalized;
  };

  const handleCloseModal = () => {
    if (selectedDateRange) {
      const normalizedFrom = selectedDateRange.from
        ? normalizeDate(selectedDateRange.from)
        : null;
      const normalizedTo = selectedDateRange.to
        ? normalizeDate(selectedDateRange.to, true)
        : null;
      if (!column) return;

      const customDateFilter: DateFilterValue = {
        label: "Personnalisé",
        range: {
          from: normalizedFrom?.toISOString() || "",
          to: normalizedTo?.toISOString() || "",
        },
      };
      column.setFilterValue(customDateFilter);
      selectedValues.clear();
      selectedValues.add("Personnalisé");
    }
    setIsModalOpen(false);
  };

  const handleFilterChange = (value: string) => {
    const isDateColumn = column?.id === "createdAt";
    const effectiveCanMultipleSelection = isDateColumn
      ? false
      : canMultipleSlection;

    if (!effectiveCanMultipleSelection && isDateColumn) {
      selectedValues.clear();
    }

    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }

    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  };

  const selectedValues = new Set<string>(
    (() => {
      const filterValue = column?.getFilterValue();
      if (Array.isArray(filterValue)) {
        return filterValue;
      }
      if (
        filterValue &&
        typeof filterValue === "object" &&
        "label" in filterValue
      ) {
        return [filterValue.label];
      }
      return [];
    })()
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge className="rounded-sm px-1 font-normal">
                    {selectedValues.size} sélectionnés
                  </Badge>
                ) : (
                  Array.from(selectedValues).map((value, index) => (
                    <Badge key={index} className="rounded-sm px-1 font-normal">
                      {value}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Aucun résultat</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (option.value === "Personnalisé") {
                        handleCustomOptionClick();
                      } else {
                        handleFilterChange(option.value);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Personnalisé</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <DatePickerWithRange
                onSelect={(date) => {
                  if (date) {
                    setSelectedDateRange(date);
                  } else {
                    setSelectedDateRange(null);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="w-auto bg-orange-500 text-white hover:bg-orange-400 hover:text-white"
              >
                Valider
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
}
