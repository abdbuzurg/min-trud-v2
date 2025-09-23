import { Phone } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./components/LoginForm";

export const metadata: Metadata = {
  title: "Соискатели работы",
};

export default function Seeker() {


  return (
    <body className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-green-100 p-8 border border-green-100 flex flex-col gap-y-2">
        <div className="flex gap-x-5 m-auto bg-white rounded-md py-5 px-15 text-center">
          <Link
            href="/job-seeker-profile"
            className="w-full flex items-center justify-center px-6 py-4 font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
          >Соискатель работы</Link>
          <Link
            href="#"
            className="w-full flex items-center justify-center px-6 py-4 font-semibold rounded-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
          >Работодатель</Link>
        </div>
      </div>
    </body>
  );
}
