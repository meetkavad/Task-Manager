import React, { useState } from "react";
import Task from "../model";
import { BsThreeDots } from "react-icons/bs";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface props {
  ListName: string;
  color: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

export const TaskList: React.FC<props> = ({
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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleEdit = (task: Task) => {
    console.log(task);
    setEditingTask(task);
    setIsFormVisible(true);
    setDropdownVisible(null);
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
    setDropdownVisible(null);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);

    let newStatus = movedTask.priority;
    if (result.destination.droppableId === "done") {
      newStatus = "Completed";
    } else if (result.destination.droppableId === "inProgress") {
      newStatus = "In Progress";
    } else if (result.destination.droppableId === "toDo") {
      newStatus = "To Do";
    }

    movedTask.priority = newStatus;
    setTasks(updatedTasks);

    // Function to update the task in the backend
    const updateTaskInBackend = async (task: Task) => {
      try {
        const response = await fetch(
          `http://localhost:8080/tasks/${task._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: newStatus,
              priority: movedTask.priority,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update task in backend");
        }
      } catch (error) {
        console.error("Error updating task in backend:", error);
      }
    };

    // Call the function to update the task in the backend
    await updateTaskInBackend(movedTask);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={ListName}>
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
                style={{
                  border: `3px solid ${color}`,
                  margin: "0px 20px",
                }}
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
                              style={{ fontWeight: "800px", fontSize: "16px" }}
                              onClick={() => {
                                setDropdownVisible(task._id);
                              }}
                            />
                            <div className="dropdown-menu">
                              <p onClick={() => handleEdit(task)}>Edit</p>
                              <p onClick={() => handleDelete(task._id)}>
                                Delete
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="task-item-name">{task.name}</p>
                      <p className="task-item-description">
                        {task.description}
                      </p>
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
    </DragDropContext>
  );
};
