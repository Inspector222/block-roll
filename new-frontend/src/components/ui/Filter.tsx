"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFilterInputStore } from "@/store/useFilterInputStore";
import clsx from "clsx";

export default function Filter({
  filterName,
  filters,
  onClick,
}: {
  filterName: string;
  filters: string[];
  onClick?: () => void;
}) {
  const { updateFilters } = useFilterInputStore();
  const inputData: { [key: string]: string } = {};
  const recordFilterInput = (filter: string) => {
    inputData[filterName] = filter;
    updateFilters(inputData);
  };

  const triggerClasses = clsx("text-sm font-medium", {
    "text-slate-500": ["Hire contributors", "Funding", "Trending"].includes(
      filterName
    ),
  });

  return (
    <div onClick={onClick}>
      <AccordionItem value={filterName} className="px-3">
        <AccordionTrigger className={triggerClasses}>
          {filterName}
        </AccordionTrigger>
        <AccordionContent
          className={
            filterName === "Hire contributors" ||
            filterName === "Funding" ||
            filterName === "Trending"
              ? "text-white-100"
              : ""
          }
        >
          <RadioGroup>
            {filters.map((filter) => (
              <div key={filter} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={filter}
                  id={filter}
                  onClick={() => {
                    recordFilterInput(filter);
                  }}
                />
                <Label
                  htmlFor={filter}
                  onClick={() => recordFilterInput(filter)}
                >
                  {filter}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
