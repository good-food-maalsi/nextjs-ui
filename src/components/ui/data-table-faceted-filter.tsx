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

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
  table: Table<TData>;
  canMultipleSlection?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  canMultipleSlection,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const handleFilterChange = (value: string) => {
    const effectiveCanMultipleSelection = canMultipleSlection ?? true;
    const currentFilterValue = column?.getFilterValue();
    const selected = new Set<string>(
      Array.isArray(currentFilterValue) ? currentFilterValue : []
    );

    if (effectiveCanMultipleSelection) {
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }
      column?.setFilterValue(
        selected.size > 0 ? Array.from(selected) : undefined
      );
    } else {
      if (
        currentFilterValue === value ||
        (Array.isArray(currentFilterValue) &&
          currentFilterValue.includes(value))
      ) {
        column?.setFilterValue(undefined);
      } else {
        column?.setFilterValue([value]);
      }
    }
  };

  const selectedValues = new Set<string>(
    Array.isArray(column?.getFilterValue())
      ? (column?.getFilterValue() as string[])
      : []
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
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
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
                      handleFilterChange(option.value);
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
      </PopoverContent>
    </Popover>
  );
}
