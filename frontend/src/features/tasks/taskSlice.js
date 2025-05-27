import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import taskService from './taskService';

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
            return await taskService.createTask(taskData, token);
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
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
            });
    },
});

export const {resetTaskStatus, clearTasks} = taskSlice.actions;

export default taskSlice.reducer;