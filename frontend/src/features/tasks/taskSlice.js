import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import taskService from './taskService';
import {showSnackbar} from '../ui/uiSlice';

const initialState = {
    tasks: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const getTasksByProject = createAsyncThunk(
    'tasks/getByProject',
    async (projectId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            return await taskService.getTasksByProject(projectId, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const newTask = await taskService.createTask(taskData, token);
            thunkAPI.dispatch(showSnackbar({message: 'Task created successfully!', severity: 'success'}));
            return newTask;
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(showSnackbar({message, severity: 'error'}));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({taskId, taskData}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const updatedTask = await taskService.updateTask(taskId, taskData, token);
            thunkAPI.dispatch(showSnackbar({message: 'Task updated successfully!', severity: 'success'}));
            return updatedTask;
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(showSnackbar({message, severity: 'error'}));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (taskId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const responseData = await taskService.deleteTask(taskId, token);
            thunkAPI.dispatch(showSnackbar({
                message: responseData.message || 'Task deleted successfully!',
                severity: 'success'
            }));
            return responseData;
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(showSnackbar({message, severity: 'error'}));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        resetTaskStatus: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        clearTasks: (state) => {
            state.tasks = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasksByProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTasksByProject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(getTasksByProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.tasks = [];
            })
            .addCase(createTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks.push(action.payload);
                state.message = 'Task created successfully!';
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                state.message = 'Task updated successfully!';
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tasks = state.tasks.filter(
                    (task) => task._id !== action.payload.id
                );
                state.message = action.payload.message || 'Task deleted successfully!';
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const {resetTaskStatus, clearTasks} = taskSlice.actions;

export default taskSlice.reducer;