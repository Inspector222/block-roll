"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectTitleStore } from "@/store/useProjectTitleStore";
import { DashboardProjectsProps } from "@/types";
import Image from "next/image";

type ProjectsContainerProps = {
  projects: DashboardProjectsProps[];
};

interface languageColorsTypes {
  [key: string]: string;
  javascript: string;
  typescript: string;
  python: string;
  go: string;
  rust: string;
  java: string;
  "c#": string;
  "c++": string;
  c: string;
  php: string;
  swift: string;
  kotlin: string;
  ruby: string;
  scala: string;
  html: string;
  elixir: string;
}

const languageColors: languageColorsTypes = {
  javascript: "bg-yellow-500/15 text-yellow-500",
  typescript: "bg-blue-500/15 text-blue-500",
  python: "bg-emerald-500/15 text-emerald-500",
  go: "bg-cyan-500/15 text-cyan-500",
  rust: "bg-orange-500/15 text-orange-500",
  java: "bg-red-500/15 text-red-500",
  "c#": "bg-purple-500/15 text-purple-500",
  "c++": "bg-indigo-500/15 text-indigo-500",
  c: "bg-gray-500/15 text-gray-500",
  php: "bg-violet-500/15 text-violet-500",
  swift: "bg-pink-500/15 text-pink-500",
  kotlin: "bg-sky-500/15 text-sky-500",
  ruby: "bg-rose-500/15 text-rose-500",
  scala: "bg-teal-500/15 text-teal-500",
  html: "bg-orange-400/15 text-orange-400",
  elixir: "bg-purple-600/15 text-purple-600",
};

const getColor = (color: string): string => {
  const lowerColorCase = color.toLowerCase();
  const _color = languageColors[lowerColorCase] || "bg-gray-200 text-gray-800";
  return _color;
};

export default function ProjectsContainer({
  projects,
}: ProjectsContainerProps) {
  const handleClick = (link: string) => {
    window.open(link, "_blank");
  };
  const { projectTitle } = useProjectTitleStore();
  const tableColums = [
    "Project",
    "Issues",
    "Language",
    "Popularity",
    "Stage",
    "Competition",
    "Activity",
  ];
  return (
    <div className="w-full rounded-lg p-2 sm:p-4">
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-xs sm:text-sm md:text-md font-semibold text-white">
          {projectTitle}
        </h2>
      </div>
      <div className="rounded-lg border bg-ox-black-2 border-ox-gray border w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="w-full border">
            <TableRow className="w-full border-ox-gray border-b">
              {tableColums.map((name, index) => (
                <TableHead
                  key={index}
                  className={`flex-1 text-center text-zinc-400 font-semibold text-ox-purple
                    text-[12px] sm:text-sm`}
                >
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="border-ox-gray border-y cursor-pointer"
                onClick={() => {
                  handleClick(project.url);
                }}
              >
                <TableCell className="flex items-center gap-1 p-1 sm:p-2">
                  <div className="rounded-full overflow-hidden inline-block h-4 w-4 sm:h-6 sm:w-6 border">
                    <Image
                      src={project.avatarUrl}
                      className="w-full h-full object-cover"
                      alt={project.name}
                      width={10}
                      height={10}
                    />
                  </div>
                  <TableCell className="text-white text-[10px] sm:text-xs text-ox-white font-semibold">
                    {project.name}
                  </TableCell>
                </TableCell>
                <TableCell className="text-white text-[10px] sm:text-xs text-center text-ox-white p-1 sm:p-2">
                  {project.totalIssueCount}
                </TableCell>
                <TableCell className="text-center p-1 sm:p-2">
                  <Badge
                    variant="secondary"
                    className={`${getColor(project.primaryLanguage)} text-[10px] sm:text-xs`}
                  >
                    {project.primaryLanguage}
                  </Badge>
                </TableCell>
                <TableCell className="text-white text-[10px] sm:text-xs text-center text-ox-white font-semibold p-1 sm:p-2">
                  {project.popularity}
                </TableCell>
                <TableCell className="text-white text-[10px] sm:text-xs text-center text-ox-white font-semibold md:table-cell p-1 sm:p-2">
                  {project.stage}
                </TableCell>
                <TableCell className="text-white text-[10px] sm:text-xs text-center text-ox-white font-semibold md:table-cell p-1 sm:p-2">
                  {project.competition}
                </TableCell>
                <TableCell className="text-white text-[10px] sm:text-xs text-center text-ox-white font-semibold md:table-cell p-1 sm:p-2">
                  {project.activity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
