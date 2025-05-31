import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { logout, reset as resetAuthStatus } from '../../src/features/auth/authSlice.js';
import {
    createProject,
    deleteProject,
    getProjects,
    resetProjectStatus,
    updateProject
} from '../features/projects/projectSlice.js';

import {
    Box,
    Typography,
    Button,
    Container,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
    Modal,
    Fab,
    Stack,
    IconButton,
    DialogActions,
    DialogContentText,
    DialogContent,
    DialogTitle,
    Dialog
} from '@mui/material';

import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
};

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
    const [newProjectData, setNewProjectData] = useState({ name: '', description: '' });

    const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [editProjectData, setEditProjectData] = useState({ name: '', description: '' });

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const {
        projects,
        isLoading: isLoadingProjects,
        isError: isErrorProjects,
        isSuccess: isSuccessProjects,
        message: messageProjects,
    } = useSelector((state) => state.project);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProjects());
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        if (isSuccessProjects && (messageProjects?.includes('created') || messageProjects?.includes('updated') || messageProjects?.includes('deleted successfully'))) {
            if (openCreateProjectModal) handleCloseCreateProjectModal();
            if (openEditProjectModal) handleCloseEditProjectModal();
            if (openDeleteConfirm) handleCloseDeleteConfirm();
        }
    }, [isSuccessProjects, messageProjects, openCreateProjectModal, openEditProjectModal, openDeleteConfirm]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetAuthStatus());
        dispatch(resetProjectStatus());
        navigate('/login');
    };

    const handleOpenCreateProjectModal = () => {
        dispatch(resetProjectStatus());
        setNewProjectData({ name: '', description: '' });
        setOpenCreateProjectModal(true);
    };

    const handleCloseCreateProjectModal = () => {
        setOpenCreateProjectModal(false);
    };

    const handleNewProjectChange = (e) => {
        setNewProjectData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCreateProjectSubmit = (e) => {
        e.preventDefault();
        dispatch(createProject(newProjectData));
    };

    const handleOpenEditProjectModal = (project) => {
        dispatch(resetProjectStatus());
        setEditingProject(project);
        setEditProjectData({ name: project.name, description: project.description || '' });
        setOpenEditProjectModal(true);
    };
    const handleCloseEditProjectModal = () => {
        setOpenEditProjectModal(false);
        setEditingProject(null);
    };
    const handleEditProjectChange = (e) => setEditProjectData({ ...editProjectData, [e.target.name]: e.target.value });

    const handleEditProjectSubmit = (e) => {
        e.preventDefault();
        if (editingProject) {
            dispatch(updateProject({ projectId: editingProject._id, projectData: editProjectData }));
        }
    };

    const handleOpenDeleteConfirm = (project) => {
        dispatch(resetProjectStatus());
        setProjectToDelete(project);
        setOpenDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setOpenDeleteConfirm(false);
        setProjectToDelete(null);
    };

    const handleConfirmDeleteProject = () => {
        if (projectToDelete) {
            dispatch(deleteProject(projectToDelete._id));
        }
    };

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Welcome
                        {user && user.name ? `, ${user.name}!` : '!'}
                    </Typography>
                </Box>

                <Divider sx={{ width: '100%', mb: 3 }} />

                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                    <Typography variant="h5" component="h2">
                        Your Projects
                    </Typography>
                    <Fab color="primary" aria-label="add project" onClick={handleOpenCreateProjectModal} size="small">
                        <AddIcon />
                    </Fab>
                </Box>

                {isLoadingProjects && projects.length === 0 && <CircularProgress
                    sx={{ mt: 2, alignSelf: 'center' }} />}

                {isErrorProjects && messageProjects && !projects.length && !isLoadingProjects && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }} onClose={() => dispatch(resetProjectStatus())}>
                        Failed to load projects: {messageProjects}
                    </Alert>
                )}


                {!isLoadingProjects && !isErrorProjects && projects.length === 0 && (
                    <Typography sx={{ mt: 2, textAlign: 'center' }}>You don't have any projects yet. Click the '+' to
                        create one!</Typography>
                )}

                {!isLoadingProjects && projects.length > 0 && (
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {projects.map((project) => (
                            <React.Fragment key={project._id}>
                                <ListItem
                                    alignItems="flex-start"
                                    button
                                    component={RouterLink}
                                    to={`/projects/${project._id}`}
                                    secondaryAction={
                                        <Stack direction="row" spacing={1}>
                                            <IconButton edge="end" aria-label="edit" onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleOpenEditProjectModal(project);
                                            }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleOpenDeleteConfirm(project);
                                            }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    }
                                >
                                    <ListItemText
                                        primary={project.name}
                                        secondary={
                                            <>
                                                <Typography sx={{ display: 'inline' }} component="span" variant="body2"
                                                            color="text.primary">
                                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                                </Typography>
                                                {project.description && ` — ${project.description}`}
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                )}

                <Modal
                    open={openCreateProjectModal}
                    onClose={handleCloseCreateProjectModal}
                    aria-labelledby="create-project-modal-title"
                >
                    <Box sx={modalStyle}>
                        <Typography id="create-project-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                            Create New Project
                        </Typography>
                        <Box component="form" onSubmit={handleCreateProjectSubmit} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Project Name"
                                name="name"
                                autoFocus
                                value={newProjectData.name}
                                onChange={handleNewProjectChange}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="description"
                                label="Project Description (Optional)"
                                name="description"
                                multiline
                                rows={3}
                                value={newProjectData.description}
                                onChange={handleNewProjectChange}
                            />
                            {isLoadingProjects &&
                                <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto 0' }} />}
                            {openCreateProjectModal && isErrorProjects && messageProjects &&
                                (messageProjects.toLowerCase().includes('mandatory') || messageProjects.toLowerCase().includes('must be at least')) && (
                                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}
                                           onClose={() => dispatch(resetProjectStatus())}>
                                        {messageProjects}
                                    </Alert>
                                )}
                            <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                                <Button onClick={handleCloseCreateProjectModal} color="inherit"
                                        disabled={isLoadingProjects}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={isLoadingProjects}>
                                    {isLoadingProjects ?
                                        <CircularProgress size={20} color="inherit" /> : 'Create Project'}
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Modal>

                {editingProject && (
                    <Modal
                        open={openEditProjectModal}
                        onClose={handleCloseEditProjectModal}
                        aria-labelledby="edit-project-modal-title"
                    >
                        <Box sx={modalStyle}>
                            <Typography id="edit-project-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                                Edit Project
                            </Typography>
                            <Box component="form" onSubmit={handleEditProjectSubmit} noValidate>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="edit-name"
                                    label="Project Name"
                                    name="name"
                                    autoFocus
                                    value={editProjectData.name}
                                    onChange={handleEditProjectChange}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    id="edit-description"
                                    label="Project Description (Optional)"
                                    name="description"
                                    multiline
                                    rows={3}
                                    value={editProjectData.description}
                                    onChange={handleEditProjectChange}
                                />
                                {isLoadingProjects &&
                                    <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto 0' }} />}
                                {openEditProjectModal && isErrorProjects && messageProjects &&
                                    (messageProjects.toLowerCase().includes('mandatory') || messageProjects.toLowerCase().includes('must be at least')) && (
                                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}
                                               onClose={() => dispatch(resetProjectStatus())}>
                                            {messageProjects}
                                        </Alert>
                                    )}
                                <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
                                    <Button onClick={handleCloseEditProjectModal} color="inherit"
                                            disabled={isLoadingProjects}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={isLoadingProjects}>
                                        {isLoadingProjects ?
                                            <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Modal>
                )}

                {projectToDelete && (
                    <Dialog
                        open={openDeleteConfirm}
                        onClose={handleCloseDeleteConfirm}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Confirm Delete Project"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete the project "{projectToDelete.name}"?
                                All associated tasks will also be deleted. This action cannot be undone.
                            </DialogContentText>
                            {isLoadingProjects &&
                                <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto 0', mt: 2 }} />}
                        </DialogContent>
                        <DialogActions sx={{ p: '16px 24px' }}>
                            <Button onClick={handleCloseDeleteConfirm} color="inherit" disabled={isLoadingProjects}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDeleteProject} color="error" variant="contained" autoFocus
                                    disabled={isLoadingProjects}>
                                {isLoadingProjects ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </Container>
    );
};

export default DashboardPage;