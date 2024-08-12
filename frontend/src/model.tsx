interface Task {
  _id: string;
  name: string;
  description: string;
  status: string;
  deadline: Date;
  priority: string;
}

export default Task;
