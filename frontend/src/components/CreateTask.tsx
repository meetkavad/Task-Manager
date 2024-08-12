import React, { useEffect } from "react";
import Task from "./model";
import { FaPlus } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { initialState } from "../App";

interface props {
  formState: typeof initialState;
  setFormState: React.Dispatch<React.SetStateAction<typeof initialState>>;
  isFormVisible: boolean;
  setIsFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isCalendarVisible: boolean;
  setIsCalendarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isSuccessVisible: boolean;
  setIsSuccessVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editingTask: Task | null;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

export const CreateTask: React.FC<props> = ({
  formState,
  setFormState,
  isFormVisible,
  setIsFormVisible,
  isCalendarVisible,
  setIsCalendarVisible,
  isSuccessVisible,
  setIsSuccessVisible,
  editingTask,
  setEditingTask,
}) => {
  useEffect(() => {
    if (editingTask) {
      setFormState(editingTask);
    } else {
      setFormState(formState);
    }
  }, [editingTask, setFormState]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAssignedToClick = async () => {
    const url = editingTask
      ? `https://task-manager-backend-4zd9.onrender.com/tasks/${editingTask._id}`
      : "https://task-manager-backend-4zd9.onrender.com/tasks/";
    const method = editingTask ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (response.status === 201) {
        console.log("Task created successfully");
      } else if (response.status === 200) {
        console.log("Task updated successfully");
      } else if (response.status === 404) {
        console.log("Task not found");
      }
    } catch (error) {
      console.error(error);
    }
    setIsFormVisible(!isFormVisible);
    setIsSuccessVisible(!isSuccessVisible);
    setEditingTask(null);
    setFormState(initialState);
  };

  return (
    <>
      <div className="create-task-container">
        <div className="create-task-wrapper">
          <div className="create-task-heading">
            <div className="heading-content">
              <p
                className="color-dot"
                style={{
                  border: `5px solid #20E7F4`,
                  borderRadius: "50%",
                }}
              ></p>
              <p>{editingTask ? "EDIT TASK" : "ADD TASK"}</p>
            </div>

            <FaPlus
              style={{ color: "#0D25FF", height: "14px", width: "14px" }}
            />
          </div>

          <div className="create-task-form">
            <div className="task-name-input-div">
              <input
                type="text"
                name="name"
                placeholder="Task Name"
                className="task-name-input"
                value={formState.name}
                onChange={handleChange}
              />
              <BsThreeDotsVertical
                style={{ color: "#9C9DA4", marginRight: "0px" }}
              />
            </div>

            <select
              name="priority"
              className="task-priority-dropdown"
              value={formState.priority}
              onChange={handleChange}
            >
              <option value="" disabled>
                Priority
              </option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>

            <textarea
              name="description"
              placeholder="Task Description"
              className="task-description-input"
              value={formState.description}
              onChange={handleChange}
            ></textarea>

            <div className="task-input-buttons">
              <button
                className="deadline-button"
                onClick={() => {
                  setIsFormVisible(!isFormVisible);
                  setIsCalendarVisible(!isCalendarVisible);
                }}
              >
                Deadline
              </button>

              <button
                className="assigned-to-button"
                onClick={handleAssignedToClick}
              >
                {editingTask ? "Update Task" : "Assigned To"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
