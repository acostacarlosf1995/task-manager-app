import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import projectService from './projectService';
import { showSnackbar } from '../ui/uiSlice';

const initialState = {
    projects: [],
    currentProject: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const createProject = createAsyncThunk(
    'projects/create',
    async (projectData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const newProject = await projectService.createProject(projectData, token);
            thunkAPI.dispatch(showSnackbar({ message: 'Project created successfully!', severity: 'success' }));
            return newProject;
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(showSnackbar({ message, severity: 'error' }));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getProjects = createAsyncThunk(
    'projects/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            return await projectService.getProjects(token);
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/update',
    async ({ projectId, projectData }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const updatedProject = await projectService.updateProject(projectId, projectData, token);
            thunkAPI.dispatch(showSnackbar({ message: 'Project updated successfully!', severity: 'success' }));
            return updatedProject;
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(showSnackbar({ message, severity: 'error' }));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/delete',
    async (projectId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            const responseData = await projectService.deleteProject(projectId, token);
            thunkAPI.dispatch(showSnackbar({ message: responseData.message || 'Project deleted successfully!', severity: 'success' }));
            return responseData;
        } catch (error) {
            const message =
                (error.response && error.response.data && (error.response.data.message || (error.response.data.errors && error.response.data.errors[0].msg))) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(showSnackbar({ message, severity: 'error' }));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        resetProjectStatus: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.projects.push(action.payload);
                state.message = 'Project created successfully';
            })
            .addCase(createProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getProjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects = action.payload;
            })
            .addCase(getProjects.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.projects = [];
            })
            .addCase(updateProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.projects.findIndex(project => project._id === action.payload._id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
                state.message = 'Project updated successfully!';
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.projects = state.projects.filter(
                    (project) => project._id !== action.payload.id
                );
                state.message = action.payload.message || 'Project deleted successfully!';
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const {resetProjectStatus} = projectSlice.actions;

export default projectSlice.reducer;