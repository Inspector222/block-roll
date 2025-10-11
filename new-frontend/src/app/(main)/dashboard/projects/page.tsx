"use client";

import { useRenderProjects } from "@/store/useRenderProjectsStore";
import Dashboard from "../page";
import { useEffect } from "react";
import { useProjectTitleStore } from "@/store/useProjectTitleStore";

const Projects = () => {
  const { setRenderProjects } = useRenderProjects();
  const { setProjectTitle } = useProjectTitleStore();

  useEffect(() => {
    setRenderProjects(false);
    setProjectTitle("Projects of the week");
  }, [setRenderProjects, setProjectTitle]);

  return <Dashboard></Dashboard>;
};

export default Projects;
