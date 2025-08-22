import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Соискатели работы",
};

export default function Seeker() {
  return (
    <body className="bg-[#98FF78]">
      <div className=" items-center h-[100vh] w-[100vw] justify-center grid place-items-center">
        <div className="flex gap-x-5 m-auto bg-white rounded-md p-15">
          <Link
            href="/job-seeker-profile"
            className="px-15 py-7.5 text-black bg-[#98FF78] rounded-xl font-bold"
          >Соискатель работы</Link>
          <Link
            href="/employer-profile"
            className="px-15 py-7.5 text-black bg-[#98FF78] rounded-xl font-bold"
          >Работодатель</Link>
        </div>
      </div>
    </body>
  );
}
