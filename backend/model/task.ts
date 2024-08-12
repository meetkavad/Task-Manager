import mongoose, {Document, Schema} from 'mongoose';

interface ITask extends Document {
    name: string;
    status: 'To Do' | 'On Progress' | 'Done' | 'Expired';
    description: string;
    deadline: Date;
    priority: 'Low' | 'High' | 'Completed';
}

const taskSchema: Schema = new mongoose.Schema({
    name: {type: String, required: true},
    status: {
        type: String,
        enum: ['To Do', 'On Progress', 'Done', 'Expired'],
        default: 'To Do'
    },
    description: String,
    deadline: Date,
    priority: {
        type: String,
        enum: ['Low','High','Completed'],
        default: 'Low'
    }
  
});

const Task =  mongoose.model<ITask>('Task', taskSchema);
export default Task;
    