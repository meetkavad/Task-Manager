import React, { useState, useEffect } from "react";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import { initialState } from "./App";

interface props {
  formState: typeof initialState;
  setFormState: React.Dispatch<React.SetStateAction<typeof initialState>>;
  isFormVisible: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isCalendarVisible: boolean;
  setIsCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Calendar: React.FC<props> = ({
  formState,
  setFormState,
  isFormVisible,
  setIsFormVisible,
  isCalendarVisible,
  setIsCalendarVisible,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  const currentDay = date.getDate();
  const currentMonth = date.getMonth();
  const monthName = months[currentMonth];
  const currentYear = date.getFullYear();

  const editedDate = new Date(formState.deadline);

  const [day, setDay] = useState<number>(editedDate.getDate());
  const [month, setMonth] = useState<string>(months[editedDate.getMonth()]);
  const [year, setYear] = useState<number>(editedDate.getFullYear());
  const [days, setDays] = useState<number[]>([]);

  useEffect(() => {
    generateDays();
  }, [month, year]);

  const generateDays = () => {
    const monthIndex = months.indexOf(month);
    const firstDay = new Date(year, monthIndex, 1).getDay(); // week day
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); // total number of days in that month

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(0); // Empty days for alignment
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    setDays(daysArray);
  };

  const past = () => {
    if (month === "January") {
      setMonth("December");
      setYear(year - 1);
    } else {
      setMonth(months[months.indexOf(month) - 1]);
    }
  };

  const future = () => {
    if (month === "December") {
      setMonth("January");
      setYear(year + 1);
    } else {
      setMonth(months[months.indexOf(month) + 1]);
    }
  };

  const handleDateClick = (d: number) => {
    const monthIndex = months.indexOf(month);
    const selectedDate = new Date(year, monthIndex, d);
    setFormState((prevState) => ({
      ...prevState,
      deadline: selectedDate,
    }));
    // console.log(formState.deadline);
    setDay(d);
    setIsFormVisible(!isFormVisible);
    setIsCalendarVisible(!isCalendarVisible);
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    const selectedDate = new Date(year, months.indexOf(month), day);
    return selectedDate < today;
  };

  return (
    <>
      <div className="calendar-container">
        <div className="calendar-wrapper">
          <div className="calendar-month">
            <button className="month-change-button" onClick={() => past()}>
              <BiSolidLeftArrow style={{ height: "20px", width: "20px" }} />
            </button>
            <p className="calendar-month-text">
              {month}, {year}
            </p>
            <button className="month-change-button" onClick={() => future()}>
              <BiSolidRightArrow style={{ height: "20px", width: "20px" }} />
            </button>
          </div>

          <div className="calendar-grid">
            {["Su", "Mo", "Tu", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div className="calendar-day-header" key={day}>
                {day}
              </div>
            ))}
            {days.map((d, index) => (
              <button
                key={index}
                className={`calendar-day ${
                  d === day &&
                  month === months[editedDate.getMonth()] &&
                  year === editedDate.getFullYear()
                    ? "selected-day"
                    : ""
                }`}
                onClick={() => d !== 0 && !isPastDate(d) && handleDateClick(d)}
                disabled={isPastDate(d)}
              >
                {d !== 0 ? d : ""}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
