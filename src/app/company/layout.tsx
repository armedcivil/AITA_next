import React from 'react';
import TopNav from '../ui/top-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="relative h-full w-full">
        <div className="absolute top-0 h-16 w-full">
          <TopNav />
        </div>
        <div className="absolute bottom-0 top-0 mt-16 h-auto w-full">
          {children}
        </div>
      </div>
      <div id="help" className="h-full"></div>
    </div>
  );
}
