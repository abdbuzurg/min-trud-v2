"use client"

import { useState } from "react";
import AuthForm from "./AuthForm";
import JobSeekerForm from "./JobSeekerForm";

export default function JobSeekerProfile() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <body>
      {!isAuthenticated

        ? <AuthForm onAuthSuccess={handleAuthSuccess} />
        : <JobSeekerForm />
      }
      
    </body>
  )
}
