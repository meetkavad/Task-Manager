import React, { useEffect, useState } from "react";
import "./App.css";
import { MainTaskTypes } from "./components/TaskTypes";
import { Navigation } from "./components/Navigation";
import { FaPlus } from "react-icons/fa6";
import Task from "./components/model";
import { TaskList } from "./components/TaskList";
import { CreateTask } from "./components/CreateTask";
import Calendar from "./components/Calendar";
import Success from "./components/sucess";

import { DragDropContext, DropResult } from "react-beautiful-dnd";
const BASE_URL = process.env.REACT_APP_BASE_URL;


export const initialState = {
  name: "",
  status: "To Do",
  description: "",
  priority: "Low",
  deadline: new Date(),
};

const App: React.FC = () => {
  const [formState, setFormState] = useState(initialState);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("all");

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/tasks/`
        );
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getTasks();
  }, []);

  // GLOBAL DRAG END
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If position is unchanged
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const updatedTasks = Array.from(tasks);
    const movedTask = updatedTasks.find((t) => t._id === draggableId);

    if (!movedTask) return;

    // Update status of the moved task
    movedTask.status = destination.droppableId;

    if (destination.droppableId === "Done") {
      movedTask.priority = "Completed";
    }

    // Reorder tasks by status + index
    updatedTasks.sort((a, b) => {
      const order: Record<string, number> = {
        "To Do": 1,
        "On Progress": 2,
        Done: 3,
      };

      return order[a.status] - order[b.status];
    });

    setTasks(updatedTasks);

    // Update in backend
    try {
      await fetch(
        `${BASE_URL}/tasks/${movedTask._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movedTask),
        }
      );
    } catch (error) {
      console.error("Failed updating backend:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;

    if (filterOption === "low") matchesFilter = task.priority === "Low";
    if (filterOption === "high") matchesFilter = task.priority === "High";
    if (filterOption === "completed") matchesFilter = task.status === "Done";
    if (filterOption === "active") matchesFilter = task.status !== "Done";

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {isFormVisible && (
        <CreateTask
          formState={formState}
          setFormState={setFormState}
          isFormVisible={isFormVisible}
          setIsFormVisible={setIsFormVisible}
          isCalendarVisible={isCalendarVisible}
          setIsCalendarVisible={setIsCalendarVisible}
          isSuccessVisible={isSuccessVisible}
          setIsSuccessVisible={setIsSuccessVisible}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          setTasks={setTasks}
        />
      )}

      {isCalendarVisible && (
        <Calendar
          formState={formState}
          setFormState={setFormState}
          isFormVisible={isFormVisible}
          setIsFormVisible={setIsFormVisible}
          isCalendarVisible={isCalendarVisible}
          setIsCalendarVisible={setIsCalendarVisible}
        />
      )}

      {isSuccessVisible && (
        <Success
          isFormVisible={isFormVisible}
          setIsFormVisible={setIsFormVisible}
          isSuccessVisible={isSuccessVisible}
          setIsSuccessVisible={setIsSuccessVisible}
        />
      )}

      <Navigation
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterOption={setFilterOption}
      />

      <div className="main-container">
        <div className="main-task-types">
          <MainTaskTypes tasks={tasks} />

          <button
            className="add-task-btn"
            onClick={() => setIsFormVisible(true)}
          >
            <FaPlus />
            Add Task
          </button>
        </div>

        {/* GLOBAL DRAG CONTEXT */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="main-task-lists">
            <TaskList
              droppableId="To Do"
              ListName="To Do"
              color="#5030E5"
              tasks={filteredTasks.filter((t) => t.status === "To Do")}
              setTasks={setTasks}
              setIsFormVisible={setIsFormVisible}
              setEditingTask={setEditingTask}
            />

            <TaskList
              droppableId="On Progress"
              ListName="On Progress"
              color="#FFA500"
              tasks={filteredTasks.filter((t) => t.status === "On Progress")}
              setTasks={setTasks}
              setIsFormVisible={setIsFormVisible}
              setEditingTask={setEditingTask}
            />

            <TaskList
              droppableId="Done"
              ListName="Done"
              color="#8BC48A"
              tasks={filteredTasks.filter((t) => t.status === "Done")}
              setTasks={setTasks}
              setIsFormVisible={setIsFormVisible}
              setEditingTask={setEditingTask}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
