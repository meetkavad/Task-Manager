import React, { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import "./styles.css";

interface NavProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setFilterOption: (value: string) => void;
}

export const Navigation: React.FC<NavProps> = ({
  searchQuery,
  setSearchQuery,
  setFilterOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="navigation">
      <div className="search-bar">
        <IoSearch style={{ height: "20px", width: "20px" }} />
        <input
          type="text"
          placeholder="Search Tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-container" ref={dropdownRef}>
        <button className="filter-button" onClick={() => setIsOpen(!isOpen)}>
          <CiFilter />
          Filter
          <IoIosArrowDown />
        </button>

        {isOpen && (
          <div className="filter-dropdown">
            <p onClick={() => setFilterOption("all")}>All Tasks</p>
            <p onClick={() => setFilterOption("active")}>Active Tasks</p>
            <p onClick={() => setFilterOption("completed")}>Completed Tasks</p>
            <p onClick={() => setFilterOption("low")}>Priority: Low</p>
            <p onClick={() => setFilterOption("high")}>Priority: High</p>
          </div>
        )}
      </div>
    </div>
  );
};
