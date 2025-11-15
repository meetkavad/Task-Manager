import React, { useEffect, useState } from "react";
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
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const BASE_URL = process.env.REACT_BASE_URL;

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
  setTasks,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill form when editing, otherwise reset to initial
  useEffect(() => {
    if (editingTask) {
      setFormState(editingTask);
    }
  }, [editingTask]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    // simple validation: name required
    if (!formState.name || String(formState.name).trim() === "") {
      setError("Task name is required");
      return false;
    }
    // optional: priority required? you can add more checks here
    setError(null);
    return true;
  };

  const handleAssignedToClick = async () => {
    // Prevent double submits
    if (isSaving) return;

    if (!validate()) return;

    setIsSaving(true);
    setError(null);

    const url = editingTask
      ? `${BASE_URL}/tasks/${editingTask._id}`
      : `${BASE_URL}/tasks/`;
    const method = editingTask ? "PATCH" : "POST";

    // Ensure deadline is a string (ISO) — backend expects a parsable date string
    const payload = {
      ...formState,
      deadline:
        formState.deadline instanceof Date
          ? formState.deadline.toISOString()
          : new Date(formState.deadline).toISOString(),
    };

    try {
      // Optional: log payload to console for debugging (remove in prod)
      // console.log("Sending payload:", payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Try parse response body safely
      let data: any = null;
      try {
        data = await response.json();
      } catch (err) {
        // no json body
        data = null;
      }

      // If backend returns an error status, show message
      if (!response.ok) {
        // If backend included validation messages, show them
        // Many express apps send { errors: ..., message: "..." } or similar
        const message =
          (data && (data.message || data.error || JSON.stringify(data))) ||
          `Server returned ${response.status}`;
        setError(String(message));
        setIsSaving(false);
        return;
      }

      // Backend may return either { task: {...} } or the task object directly
      const savedTask = (data && (data.task || data)) || null;

      if (!savedTask) {
        // If no task in response, but response was ok, try to construct the task from payload
        // (this is a fallback — ideally backend returns the created/updated doc)
        const synthetic: any = {
          ...payload,
        };
        // _id probably missing; backend will have created id in DB — better to refetch if needed
        setTasks((prev) => [...prev, synthetic]);
      } else {
        if (response.status === 201 || !editingTask) {
          // Created
          setTasks((prev) => [...prev, savedTask]);
        } else {
          // Updated
          setTasks((prev) =>
            prev.map((t) => (t._id === savedTask._id ? savedTask : t))
          );
        }
      }

      // Close form + show success
      setIsFormVisible(false);
      setIsSuccessVisible(true);
      setEditingTask(null);
      setFormState(initialState);
    } catch (err) {
      console.error("Network / Save error:", err);
      setError("Network error. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="create-task-container" role="dialog" aria-modal="true">
      <div className="create-task-wrapper">
        <div className="create-task-heading">
          <div className="heading-content">
            <p
              className="color-dot"
              style={{
                border: `5px solid #20E7F4`,
                borderRadius: "50%",
              }}
            />
            <p>{editingTask ? "EDIT TASK" : "ADD TASK"}</p>
          </div>

          <FaPlus style={{ color: "#0D25FF", height: 14, width: 14 }} />
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
              autoFocus
            />
            <BsThreeDotsVertical style={{ color: "#9C9DA4" }} />
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
          />

          {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}

          <div className="task-input-buttons" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="deadline-button"
              onClick={() => {
                setIsFormVisible(false);
                setIsCalendarVisible(true);
              }}
            >
              Deadline
            </button>

            <button
              type="button"
              className="assigned-to-button"
              onClick={handleAssignedToClick}
              disabled={isSaving}
            >
              {isSaving
                ? editingTask
                  ? "Updating..."
                  : "Creating..."
                : editingTask
                ? "Update Task"
                : "Assigned To"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
