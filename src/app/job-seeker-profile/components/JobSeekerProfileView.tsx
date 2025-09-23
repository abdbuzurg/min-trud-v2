"use client"

import { useState } from "react";
import AuthForm from "./AuthForm";
import JobSeekerForm from "./JobSeekerFormVer";
import { useRouter } from "next/navigation";

export default function JobSeekerProfile() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  const handleAuthSuccess = (token: string | null, phoneNumber: string) => {
    if (!token) {
      console.log("111")
      setIsAuthenticated(true);
      setPhoneNumber(phoneNumber)
    } else {
      localStorage.setItem("token", token)
      const page = `/job-seeker/${phoneNumber}`
      router.replace(page)
    }
  };

  return (
    <body>
      {!isAuthenticated
        ? <AuthForm onAuthSuccess={handleAuthSuccess} />
        : <JobSeekerForm phoneNumber={phoneNumber} />
      }

    </body>
  )
}
