"use client";

import { useEffect, useState } from "react";

export default function Copyright() {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className="w-full border-t border-border text-card-foreground py-4 flex justify-center items-center"
      style={{ backgroundColor: "oklch(27.9% 0.041 260.031)" }}
    >
      <div className="flex flex-col md:flex-row items-center space-x-2 text-center">
        <span className="font-medium text-foreground">
          © {year} Kisan Public School.
        </span>
        <span className="text-muted-foreground">All rights reserved.</span>
      </div>
    </footer>
  );
}
