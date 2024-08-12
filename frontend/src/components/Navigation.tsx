import React from "react";
import { IoSearch } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import "./styles.css";

export const Navigation: React.FC = () => {
  return (
    <>
      <div className="navigation">
        <div className="search-bar">
          <IoSearch style={{ height: "20px", width: "20px" }} />
          <input type="text" placeholder="Search Project" />
        </div>

        <button className="filter-button">
          <CiFilter />
          Filter
          <IoIosArrowDown />
        </button>
      </div>
    </>
  );
};
