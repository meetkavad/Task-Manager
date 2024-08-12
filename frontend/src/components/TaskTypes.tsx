import React from "react";
import "./styles.css";
import { FaPlus } from "react-icons/fa";
import Task from "./model"; // Assuming Task is imported from a model file

interface props {
  icon: string;
  name: string;
  num: number;
  total_num?: number;
}

export const TaskTypes: React.FC<props> = ({
  icon,
  name,
  num,
  total_num,
}: props) => {
  return (
    <div className="task-type-container">
      <img src={icon} alt="task-type-image" className="task-type-image" />
      <p>{name}</p>
      <p className="num-tasks">
        {num}
        {total_num !== undefined && (
          <span className="total-num-span">/{total_num}</span>
        )}
      </p>
    </div>
  );
};

interface MainTaskTypesProps {
  tasks: Task[];
}

export const MainTaskTypes: React.FC<MainTaskTypesProps> = ({ tasks }) => {
  const currentDate = new Date();

  const expiredTasks = tasks.filter(
    (task) => new Date(task.deadline) < currentDate && task.status !== "done"
  );
  const completedTasks = tasks.filter((task) => task.status === "done");
  const activeTasks = tasks.filter(
    (task) => new Date(task.deadline) >= currentDate && task.status !== "done"
  );

  return (
    <>
      <TaskTypes
        icon={"/images/expired.png"}
        name={"Expired Tasks"}
        num={expiredTasks.length}
      />
      <TaskTypes
        icon={"/images/active.png"}
        name={"All Active Tasks"}
        num={activeTasks.length}
      />
      <TaskTypes
        icon={"/images/completed.png"}
        name={"Completed Tasks"}
        num={completedTasks.length}
        total_num={activeTasks.length}
      />
    </>
  );
};
