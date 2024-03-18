import React from "react";
import TopNav from "../ui/top-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 h-16 w-full">
        <TopNav />
      </div>
      <div className="absolute bottom-0 mt-16 top-0 h-auto w-full">
        {children}
      </div>
    </div>
  );
}
