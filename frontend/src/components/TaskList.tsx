import React, { useState } from "react";
import Task from "./model";
import { BsThreeDots } from "react-icons/bs";
import { Droppable, Draggable } from "react-beautiful-dnd";

interface props {
  droppableId: string;
  ListName: string;
  color: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const TaskList: React.FC<props> = ({
  droppableId,
  ListName,
  color,
  tasks,
  setTasks,
  setIsFormVisible,
  setEditingTask,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "Low":
        return "priority-low";
      case "High":
        return "priority-high";
      case "Completed":
        return "priority-completed";
      default:
        return "";
    }
  };

  const formattedDate = (deadline: Date) => {
    const date = new Date(deadline);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormVisible(true);
    setDropdownVisible(null);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      // Update UI instantly
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error("Delete error:", error);
    }

    setDropdownVisible(null);
  };

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="task-list-container"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className="task-list-fixed-part">
            <div className="task-list-heading">
              <p
                className="color-dot"
                style={{ border: `5px solid ${color}`, borderRadius: "50px" }}
              ></p>
              <p className="task-list-name">{ListName}</p>
              <p className="list-task-num">{tasks.length}</p>
            </div>

            <div
              className="color-border"
              style={{ border: `3px solid ${color}`, margin: "0px 20px" }}
            ></div>
          </div>

          <div className="task-container">
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    className="task-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="task-item-top">
                      <p
                        className={`task-priority ${getPriorityClass(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </p>

                      <div className="dropdown-container">
                        <div className="dropdown-icon">
                          <BsThreeDots
                            style={{ fontSize: "16px" }}
                            onClick={() =>
                              setDropdownVisible(
                                dropdownVisible === task._id ? null : task._id
                              )
                            }
                          />

                          {dropdownVisible === task._id && (
                            <div className="dropdown-menu">
                              <p onClick={() => handleEdit(task)}>Edit</p>
                              <p onClick={() => handleDelete(task._id)}>
                                Delete
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="task-item-name">{task.name}</p>
                    <p className="task-item-description">{task.description}</p>

                    <p className="deadline-text">
                      Deadline:{" "}
                      <span className="item-deadline">
                        {formattedDate(task.deadline)}
                      </span>
                    </p>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};
