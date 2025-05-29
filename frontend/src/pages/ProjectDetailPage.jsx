import React, {useEffect, useState} from 'react';
import {useParams, Link as RouterLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { useTheme } from '@mui/material/styles';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import {
    getTasksByProject,
    resetTaskStatus,
    clearTasks,
    createTask,
    updateTask,
    deleteTask
} from '../features/tasks/taskSlice';
import {
    FormControl,
    InputLabel,
    Modal,
    Paper,
    Select,
    Stack,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem, IconButton
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ProjectDetailPage = () => {
    const {projectId} = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();

    const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
    const [newTaskData, setNewTaskData] = useState({
        title: '', description: '', status: 'pending', dueDate: '',
    });

    const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskData, setEditTaskData] = useState({
        title: '', description: '', status: 'pending', dueDate: '',
    });

    const [openDeleteTaskConfirm, setOpenDeleteTaskConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const project = useSelector((state) =>
        state.project.projects.find((p) => p._id === projectId)
    );

    const {
        tasks,
        isLoading: isLoadingTasks,
        isSuccess: isSuccessTasks,
        isError: isErrorTasks,
        message: messageTasks,
    } = useSelector((state) => state.task);

    const statuses = ['pending', 'in-progress', 'completed'];
    const statusTitles = {
        pending: 'Pending',
        'in-progress': 'In Progress',
        completed: 'Completed',
    };

    const onDragEnd = (result) => {
        const {source, destination, draggableId} = result;

        if (!destination) {
            // console.log('Destination is NULL or UNDEFINED. Aborting.');
            return;
        }
        if (!source) {
            // console.log('Source is NULL or UNDEFINED. Aborting.');
            return;
        }
        if (!draggableId) {
            // console.log('DraggableId is NULL or UNDEFINED. Aborting.');
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            // console.log('Dropped in the same place.');
            return;
        }

        const taskToUpdate = tasks.find(task => task._id === draggableId);
        const newStatus = destination.droppableId;

        if (taskToUpdate && taskToUpdate.status !== newStatus) {
            const updatedTaskData = {
                title: taskToUpdate.title,
                description: taskToUpdate.description,
                dueDate: taskToUpdate.dueDate,
                status: newStatus,
            };
            dispatch(updateTask({taskId: draggableId, taskData: updatedTaskData}));
        }
    };

    useEffect(() => {
        if (projectId) {
            dispatch(getTasksByProject(projectId));
        }
        return () => {
            dispatch(resetTaskStatus());
            dispatch(clearTasks());
        };
    }, [projectId, dispatch]);

    useEffect(() => {
        if (isSuccessTasks) {
            if (openCreateTaskModal) handleCloseCreateTaskModal();
            if (openEditTaskModal) handleCloseEditTaskModal();
            if (openDeleteTaskConfirm) handleCloseDeleteTaskConfirm();
        }
    }, [isSuccessTasks, openCreateTaskModal, openEditTaskModal, openDeleteTaskConfirm, dispatch]);

    const handleOpenCreateTaskModal = () => {
        dispatch(resetTaskStatus());
        setNewTaskData({title: '', description: '', status: 'pending', dueDate: ''});
        setOpenCreateTaskModal(true);
    };
    const handleCloseCreateTaskModal = () => {
        setOpenCreateTaskModal(false);
        setNewTaskData({title: '', description: '', status: 'pending', dueDate: ''});
        dispatch(resetTaskStatus());
    };
    const handleNewTaskChange = (e) => {
        setNewTaskData((prevState) => ({...prevState, [e.target.name]: e.target.value}));
    };
    const handleCreateTaskSubmit = (e) => {
        e.preventDefault();
        const taskPayload = {...newTaskData, projectId: projectId};
        if (!taskPayload.dueDate) delete taskPayload.dueDate;
        dispatch(createTask(taskPayload));
    };

    const handleOpenEditTaskModal = (task) => {
        dispatch(resetTaskStatus());
        setEditingTask(task);
        setEditTaskData({
            title: task.title,
            description: task.description || '',
            status: task.status,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        });
        setOpenEditTaskModal(true);
    };
    const handleCloseEditTaskModal = () => {
        setOpenEditTaskModal(false);
        setEditingTask(null);
        setEditTaskData({title: '', description: '', status: 'pending', dueDate: ''});
        dispatch(resetTaskStatus());
    };
    const handleEditTaskChange = (e) => {
        setEditTaskData((prevState) => ({...prevState, [e.target.name]: e.target.value}));
    };
    const handleEditTaskSubmit = (e) => {
        e.preventDefault();
        if (editingTask) {
            const payload = {taskId: editingTask._id, taskData: {...editTaskData}};
            if (!payload.taskData.dueDate) delete payload.taskData.dueDate;
            dispatch(updateTask(payload));
        }
    };

    const handleOpenDeleteTaskConfirm = (task) => {
        dispatch(resetTaskStatus());
        setTaskToDelete(task);
        setOpenDeleteTaskConfirm(true);
    };
    const handleCloseDeleteTaskConfirm = () => {
        setOpenDeleteTaskConfirm(false);
        setTaskToDelete(null);
        if (isErrorTasks) {
            dispatch(resetTaskStatus());
        }
    };
    const handleConfirmDeleteTask = () => {
        if (taskToDelete && taskToDelete._id) {
            dispatch(deleteTask(taskToDelete._id));
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{marginTop: 4}}>
                <Button component={RouterLink} to="/dashboard" sx={{mb: 2}} variant="outlined">
                    Back to Dashboard
                </Button>
                <Typography variant="h4" component="h1" gutterBottom>
                    {project ? `Project: ${project.name}` : `Project Details: ${projectId}`}
                </Typography>
                {project && project.description && (
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {project.description}
                    </Typography>
                )}
                <Divider sx={{my: 2}}/>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                    <Typography variant="h5" component="h2"> Tasks </Typography>
                    <Fab color="secondary" aria-label="add task" size="small" onClick={handleOpenCreateTaskModal}>
                        <AddIcon/> </Fab>
                </Box>

                {isLoadingTasks && tasks.length === 0 &&
                    <CircularProgress sx={{display: 'block', margin: '20px auto'}}/>
                }

                {isErrorTasks && messageTasks && !openCreateTaskModal && !openEditTaskModal && !openDeleteTaskConfirm && (
                    <Alert severity="error" onClose={() => dispatch(resetTaskStatus())}>{messageTasks}</Alert>
                )}

                {!isLoadingTasks && !isErrorTasks && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Stack direction="row" spacing={2}
                               sx={{mt: 3, overflowX: 'auto', pb: 2}}>
                            {statuses.map((statusKey) => {
                                const columnTasks = tasks.filter(task => task.status === statusKey);
                                return (
                                    <Droppable droppableId={statusKey} key={statusKey}>
                                        {(provided, snapshot) => (
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 2,
                                                    width: 300,
                                                    minWidth: 280,
                                                    maxHeight: '70vh',
                                                    overflowY: 'auto',
                                                    bgcolor: snapshot.isDraggingOver ? 'grey.200' : (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'),
                                                }}
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                            >
                                                <Typography variant="h6" gutterBottom sx={{textAlign: 'center', mb: 2}}>
                                                    {statusTitles[statusKey]} ({columnTasks.length})
                                                </Typography>
                                                {columnTasks.map((task, index) => (
                                                    <Draggable draggableId={task._id} index={index} key={task._id}>
                                                        {(providedDraggable, snapshotDraggable) => (
                                                            <Paper
                                                                elevation={snapshotDraggable.isDragging ? 8 : 2}
                                                                sx={{
                                                                    p: 1.5, mb: 1.5, userSelect: 'none',
                                                                    backgroundColor: snapshotDraggable.isDragging
                                                                        ? (theme.palette.mode === 'dark' ? theme.palette.action.selected : 'lightblue')
                                                                        : theme.palette.background.paper,
                                                                }}
                                                                ref={providedDraggable.innerRef}
                                                                {...providedDraggable.draggableProps}
                                                                {...providedDraggable.dragHandleProps}
                                                            >
                                                                <Stack direction="row" justifyContent="space-between"
                                                                       alignItems="center">
                                                                    <Typography variant="subtitle1"
                                                                                sx={{fontWeight: 'bold'}}>{task.title}</Typography>
                                                                    <Stack direction="row" spacing={0}>
                                                                        <IconButton edge="end" aria-label="edit task"
                                                                                    onClick={() => handleOpenEditTaskModal(task)}
                                                                                    size="small">
                                                                            <EditIcon fontSize="small"/>
                                                                        </IconButton>
                                                                        <IconButton edge="end" aria-label="delete task"
                                                                                    onClick={() => handleOpenDeleteTaskConfirm(task)}
                                                                                    size="small" color="error">
                                                                            <DeleteIcon fontSize="small"/>
                                                                        </IconButton>
                                                                    </Stack>
                                                                </Stack>
                                                                {task.description && <Typography variant="body2"
                                                                                                 sx={{my: 1}}>{task.description}</Typography>}
                                                                {task.dueDate && (
                                                                    <Typography variant="caption" color="text.secondary"
                                                                                display="block">
                                                                        Due: {new Date(task.dueDate).toLocaleDateString('es-MX', {timeZone: 'UTC'})}
                                                                    </Typography>
                                                                )}
                                                            </Paper>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Paper>
                                        )}
                                    </Droppable>
                                );
                            })}
                        </Stack>
                    </DragDropContext>
                )}

                {!isLoadingTasks && !isErrorTasks && tasks.length === 0 && (
                    <Typography sx={{mt: 4, textAlign: 'center'}}>
                        No tasks found for this project yet. Click the '+' to create one!
                    </Typography>
                )}
            </Box>

            <Modal open={openCreateTaskModal} onClose={handleCloseCreateTaskModal}
                   aria-labelledby="create-task-modal-title">
                <Box sx={modalStyle}>
                    <Typography id="create-task-modal-title" variant="h6" component="h2">Create New Task
                        for {project ? `"${project.name}"` : 'Project'}</Typography>
                    <Box component="form" onSubmit={handleCreateTaskSubmit} noValidate sx={{mt: 2}}>
                        <TextField margin="normal" required fullWidth id="task-title" label="Task Title" name="title"
                                   autoFocus value={newTaskData.title} onChange={handleNewTaskChange}/>
                        <TextField margin="normal" fullWidth id="task-description" label="Task Description (Optional)"
                                   name="description" multiline rows={3} value={newTaskData.description}
                                   onChange={handleNewTaskChange}/>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="task-status-select-label">Status</InputLabel>
                            <Select labelId="task-status-select-label" id="task-status-select" name="status"
                                    value={newTaskData.status} label="Status" onChange={handleNewTaskChange}>
                                <MenuItem value="pending">pending</MenuItem>
                                <MenuItem value="in-progress">in-progress</MenuItem>
                                <MenuItem value="completed">completed</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField margin="normal" fullWidth id="task-dueDate" label="Due Date (YYYY-MM-DD)"
                                   name="dueDate" type="date" value={newTaskData.dueDate} onChange={handleNewTaskChange}
                                   InputLabelProps={{shrink: true}}/>
                        {isLoadingTasks && <CircularProgress size={24} sx={{display: 'block', margin: '10px auto'}}/>}
                        {isErrorTasks && messageTasks && openCreateTaskModal && (
                            <Alert severity="error" sx={{width: '100%', mt: 1}}
                                   onClose={() => dispatch(resetTaskStatus())}>{messageTasks}</Alert>)}
                        <Stack direction="row" spacing={2} sx={{mt: 3, justifyContent: 'flex-end'}}>
                            <Button onClick={handleCloseCreateTaskModal} color="inherit"
                                    disabled={isLoadingTasks}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={isLoadingTasks}>{isLoadingTasks ?
                                <CircularProgress size={20} color="inherit"/> : 'Create Task'}</Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            {editingTask && (
                <Modal open={openEditTaskModal} onClose={handleCloseEditTaskModal}
                       aria-labelledby="edit-task-modal-title">
                    <Box sx={modalStyle}>
                        <Typography id="edit-task-modal-title" variant="h6" component="h2">Edit Task</Typography>
                        <Box component="form" onSubmit={handleEditTaskSubmit} noValidate sx={{mt: 2}}>
                            <TextField margin="normal" required fullWidth id="edit-task-title" label="Task Title"
                                       name="title" autoFocus value={editTaskData.title}
                                       onChange={handleEditTaskChange}/>
                            <TextField margin="normal" fullWidth id="edit-task-description"
                                       label="Task Description (Optional)" name="description" multiline rows={3}
                                       value={editTaskData.description} onChange={handleEditTaskChange}/>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="edit-task-status-select-label">Status</InputLabel>
                                <Select labelId="edit-task-status-select-label" id="edit-task-status-select"
                                        name="status" value={editTaskData.status} label="Status"
                                        onChange={handleEditTaskChange}>
                                    <MenuItem value="pending">pending</MenuItem>
                                    <MenuItem value="in-progress">in-progress</MenuItem>
                                    <MenuItem value="completed">completed</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField margin="normal" fullWidth id="edit-task-dueDate" label="Due Date (YYYY-MM-DD)"
                                       name="dueDate" type="date" value={editTaskData.dueDate}
                                       onChange={handleEditTaskChange} InputLabelProps={{shrink: true}}/>
                            {isLoadingTasks &&
                                <CircularProgress size={24} sx={{display: 'block', margin: '10px auto'}}/>}
                            {isErrorTasks && messageTasks && openEditTaskModal && (
                                <Alert severity="error" sx={{width: '100%', mt: 1}}
                                       onClose={() => dispatch(resetTaskStatus())}>{messageTasks}</Alert>)}
                            <Stack direction="row" spacing={2} sx={{mt: 3, justifyContent: 'flex-end'}}>
                                <Button onClick={handleCloseEditTaskModal} color="inherit"
                                        disabled={isLoadingTasks}>Cancel</Button>
                                <Button type="submit" variant="contained" disabled={isLoadingTasks}>{isLoadingTasks ?
                                    <CircularProgress size={20} color="inherit"/> : 'Save Changes'}</Button>
                            </Stack>
                        </Box>
                    </Box>
                </Modal>
            )}

            {taskToDelete && (
                <Dialog open={openDeleteTaskConfirm} onClose={handleCloseDeleteTaskConfirm}
                        aria-labelledby="delete-task-dialog-title">
                    <DialogTitle id="delete-task-dialog-title">{"Confirm Delete Task"}</DialogTitle>
                    <DialogContent><DialogContentText>Are you sure you want to delete the task "{taskToDelete.title}"?
                        This action cannot be undone.</DialogContentText>
                        {isLoadingTasks && <CircularProgress size={24} sx={{display: 'block', margin: '10px auto'}}/>}
                        {isErrorTasks && messageTasks && openDeleteTaskConfirm && (
                            <Alert severity="error" sx={{width: '100%', mt: 2}}
                                   onClose={() => dispatch(resetTaskStatus())}>{messageTasks}</Alert>)}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteTaskConfirm} color="inherit"
                                disabled={isLoadingTasks}>Cancel</Button>
                        <Button onClick={handleConfirmDeleteTask} color="error" variant="contained" autoFocus
                                disabled={isLoadingTasks}>{isLoadingTasks ?
                            <CircularProgress size={20} color="inherit"/> : 'Delete'}</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default ProjectDetailPage;