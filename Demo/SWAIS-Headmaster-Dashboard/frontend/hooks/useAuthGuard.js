"use client";

import { useEffect, useState } from "react";

export default function useAuthGuard() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    //if (!token) {
      //window.location.replace("https://staging.dem.swais.in");
      //return;
    //}

    setAuthenticated(true);
  }, []);

  return authenticated;
}