"use client";

import Header from "../ui/header";

const Brands = () => {
  // Mock BlockRoll statistics
  const mockStats = {
    queries: "23,523",
    users: "8,859"
  };


  return (
    <div id="Stats" className="flex flex-col">
      <Header title="Statistics" />
      <div className="border-b border-[#252525] flex items-center w-full">
        <div className="relative [box-shadow:0_0_100px_-10px_#14111C_inset] flex items-center justify-center bg-[#101010] w-full border-r border-[#252525] flex-col p-10  md:text-5xl">
          <span
            className="md:text-7xl md:text-[76px] relative pointer-events-none text-center bg-gradient-to-b from-[#9159E2] to-[#341e7b] to-80% bg-clip-text text-transparent text-[clamp(1rem,10vw,6rem)] overflow-hidden font-mono tracking-tighter font-medium"
            style={{
              textShadow: "0 0 40px rgba(145, 89, 226, 0.5)",
            }}
          >
            {mockStats.queries}+
          </span>
          <span
            style={{ "--text": "BlockRoll" } as any}
            className=" relative pointer-events-none text-center before:bg-gradient-to-b  before:from-[#9159E2] before:to-[#321D76] before:to-80% before:bg-clip-text before:text-transparent before:content-['Queries'] after:absolute after:inset-0 after:bg-purple-600 after:bg-clip-text after:text-transparent  after:mix-blend-lighten after:content-['Queries'] after:[text-shadow:0_1px_0_black] overflow-hidden font-mono tracking-tighter font-medium text-3xl md:text-5xl"
          ></span>
        </div>
        <div className="relative flex [box-shadow:0_0_0px_-10px_#14111C_inset] items-center justify-center bg-[#101010] w-full  border-[#252525] flex-col p-10  md:text-5xl">
          <span
            className="md:text-7xl md:text-[76px] relative pointer-events-none text-center bg-gradient-to-b from-[#9159E2] to-[#341e7b] to-80% bg-clip-text text-transparent text-[clamp(1rem,10vw,6rem)] overflow-hidden font-mono tracking-tighter font-medium"
            style={{
              textShadow: "0 0 40px rgba(145, 89, 226, 0.5)",
            }}
          >
            {mockStats.users}+
          </span>
          <span
            style={{ "--text": "BlockRoll" } as any}
            className=" relative pointer-events-none text-center before:bg-gradient-to-b  before:from-[#9159E2] before:to-[#321D76] before:to-80% before:bg-clip-text before:text-transparent before:content-['Users'] after:absolute after:inset-0 after:bg-purple-600 after:bg-clip-text after:text-transparent  after:mix-blend-lighten after:content-['Users'] after:[text-shadow:0_1px_0_black] overflow-hidden font-mono tracking-tighter font-medium text-3xl md:text-5xl"
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Brands;
