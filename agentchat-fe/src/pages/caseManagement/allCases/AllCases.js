import React, { useState } from 'react';
import AllCard from './AllCard';
import CaseNavbar from '../CaseNavbar';

function AllCases() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="App bg-[#e9ecef] flex min-h-screen">
      <div className="flex flex-col w-full">
        <CaseNavbar onSearchChange={handleSearchChange} />
        <div className="p-4">
          <AllCard searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}

export default AllCases;
 