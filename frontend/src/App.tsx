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

export const initialState = {
  name: "",
  status: "To Do",
  description: "",
  priority: "Low",
  deadline: new Date(),
};

const App: React.FC = () => {
  const [formState, setFormState] = useState(initialState);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch("https://task-manager-backend-4zd9.onrender.com/tasks/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setTasks(data.tasks);
        } else {
          console.log("Tasks not found");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getTasks();
  }, [tasks]);

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

      <Navigation />
      <div className="main-container">
        <div className="main-task-types">
          <MainTaskTypes tasks={tasks} />

          <button
            className="add-task-btn"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            <FaPlus />
            Add Task
          </button>
        </div>

        <div className="main-task-lists">
          <TaskList
            ListName="To Do"
            color="#5030E5"
            tasks={tasks.filter((task) => task.status === "To Do")}
            setTasks={setTasks}
            setIsFormVisible={setIsFormVisible}
            setEditingTask={setEditingTask}
          />
          <TaskList
            ListName="On Progress"
            color="#FFA500"
            tasks={tasks.filter((task) => task.status === "On Progress")}
            setTasks={setTasks}
            setIsFormVisible={setIsFormVisible}
            setEditingTask={setEditingTask}
          />
          <TaskList
            ListName="Done"
            color="#8BC48A"
            tasks={tasks.filter((task) => task.status === "Done")}
            setTasks={setTasks}
            setIsFormVisible={setIsFormVisible}
            setEditingTask={setEditingTask}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
