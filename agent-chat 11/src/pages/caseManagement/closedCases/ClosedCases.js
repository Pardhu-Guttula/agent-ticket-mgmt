import React, { useState } from "react";
import CaseNavBar from "../CaseNavbar";
import ClosedCard from "./ClosedCard";

function ClosedCases() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="App bg-[#e9ecef] flex min-h-screen">
      <div className="flex flex-col w-full">
        <CaseNavBar onSearchChange={handleSearchChange} />
        <div className="p-4">
          <ClosedCard searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}

export default ClosedCases;
 