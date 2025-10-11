"use client";

import { useProjectsData } from "@/store/useProjectsDataStore";
import ProjectsContainer from "./ProjectsContainer";
import { useRenderProjects } from "@/store/useRenderProjectsStore";
import { useLoading } from "@/store/useLoadingStore";
import { useProjectsNotFoundStore } from "@/store/useProjectsFoundStore";
import { ErrMsg } from "../ui/ErrMsg";
import SpinnerElm from "../ui/SpinnerElm";

export default function DashboardContainer() {
  const { renderProjects } = useRenderProjects();
  const { data } = useProjectsData();
  const { loading } = useLoading();
  const { projectsNotFound } = useProjectsNotFoundStore();
  return (
    <div
      className={`h-[80vh] md:h-[88vh] rounded-lg mx-1 md:mx-4 bg-ox-black-1 border border-ox-gray ${!renderProjects ? "flex items-center justify-center" : ""}`}
    >
      <div className={`max-h-full ${!loading ? "overflow-y-scroll" : ""}`}>
        {renderProjects && (
          <ProjectsContainer projects={data}></ProjectsContainer>
        )}
        {loading && (
          <SpinnerElm text={"loading cool projects for you..."}></SpinnerElm>
        )}
        {projectsNotFound && (
          <ErrMsg
            text={
              "No projects were found matching the selected filters. Please adjust the filters and try again."
            }
          ></ErrMsg>
        )}
        {!renderProjects && !loading && (
          <ErrMsg
            text={"Click on 'Find Projects' to see the magic."}
          ></ErrMsg>
        )}
      </div>
    </div>
  );
}
