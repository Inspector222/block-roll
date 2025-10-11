import SignInPage from "@/components/login/SignInPage";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center relative bg-[#101010]">
      <div className=" z-10">
        <SignInPage></SignInPage>
      </div>
    </div>
  );
}
