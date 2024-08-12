import React from "react";
import Task from "./model";

interface Props {
  isFormVisible: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isSuccessVisible: boolean;
  setIsSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Success: React.FC<Props> = ({
  isFormVisible,
  setIsFormVisible,
  isSuccessVisible,
  setIsSuccessVisible,
}) => {
  return (
    <>
      <div className="success-container">
        <div className="success-wrapper">
          <img src="/images/done.png" alt="done-image" className="done-image" />
          <p className="success-text">new task has been created successfully</p>
          <button
            className="back-btn"
            onClick={() => setIsSuccessVisible(!isSuccessVisible)}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Success;
