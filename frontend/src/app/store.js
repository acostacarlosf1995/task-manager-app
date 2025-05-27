import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import projectReducer from "../features/projects/projectSlice.js";
import taskReducer from "../features/tasks/taskSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        project: projectReducer,
        task: taskReducer,
    },
});