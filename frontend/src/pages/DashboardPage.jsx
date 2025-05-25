import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {logout, reset as resetAuthStatus} from '../../src/features/auth/authSlice.js'; // Corregido: ruta a authSlice
import {createProject, getProjects, resetProjectStatus, updateProject} from '../features/projects/projectSlice.js';

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
    IconButton
} from '@mui/material';

import {
    Add as AddIcon,
    Edit as EditIcon
} from '@mui/icons-material';

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

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
    const [newProjectData, setNewProjectData] = useState({name: '', description: ''});

    const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [editProjectData, setEditProjectData] = useState({name: '', description: ''});

    const {user, isAuthenticated} = useSelector((state) => state.auth);

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
        if (isSuccessProjects && messageProjects && (messageProjects.includes('created') || messageProjects.includes('updated') || messageProjects.includes('deleted'))) {
            if (openCreateProjectModal) {
                handleCloseCreateProjectModal();
            }
            if (openEditProjectModal) {
                handleCloseEditProjectModal();
            }
        }
    }, [isSuccessProjects, messageProjects, openCreateProjectModal, openEditProjectModal, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetAuthStatus());
        dispatch(resetProjectStatus());
        navigate('/login');
    };

    const handleOpenCreateProjectModal = () => {
        dispatch(resetProjectStatus());
        setNewProjectData({name: '', description: ''});
        setOpenCreateProjectModal(true);
    };

    const handleCloseCreateProjectModal = () => {
        setOpenCreateProjectModal(false);
        setNewProjectData({name: '', description: ''});
        dispatch(resetProjectStatus());
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
        setEditProjectData({name: project.name, description: project.description || ''});
        setOpenEditProjectModal(true);
    };
    const handleCloseEditProjectModal = () => {
        setOpenEditProjectModal(false);
        setEditingProject(null);
        setEditProjectData({name: '', description: ''});
        dispatch(resetProjectStatus());
    };
    const handleEditProjectChange = (e) => setEditProjectData({...editProjectData, [e.target.name]: e.target.value});

    const handleEditProjectSubmit = (e) => {
        e.preventDefault();
        if (editingProject) {
            dispatch(updateProject({projectId: editingProject._id, projectData: editProjectData}));
        }
    };

    const isFormValidationError = messageProjects &&
        (messageProjects.toLowerCase().includes('mandatory') ||
            messageProjects.toLowerCase().includes('invalid id') ||
            messageProjects.toLowerCase().includes('must be at least') ||
            messageProjects.toLowerCase().includes('obligatorio') ||
            messageProjects.toLowerCase().includes('válido'));


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
                    sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2}}>
                    <Typography variant="h4" component="h1">
                        Welcome
                        {user && user.name ? `, ${user.name}!` : '!'}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>

                <Divider sx={{width: '100%', mb: 3}}/>

                <Box
                    sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2}}>
                    <Typography variant="h5" component="h2">
                        Your Projects
                    </Typography>
                    <Fab color="primary" aria-label="add project" onClick={handleOpenCreateProjectModal} size="small">
                        <AddIcon/>
                    </Fab>
                </Box>

                {isLoadingProjects && projects.length === 0 && <CircularProgress
                    sx={{mt: 2, alignSelf: 'center'}}/>}

                {/* Alert General: Se muestra si hay un error, si los modales están cerrados, y si el error NO es un error de validación de formulario típico */}
                {isErrorProjects && messageProjects && !openCreateProjectModal && !openEditProjectModal && !isFormValidationError && (
                    <Alert severity="error" sx={{width: '100%', mt: 2}} onClose={() => dispatch(resetProjectStatus())}>
                        {messageProjects}
                    </Alert>
                )}

                {!isLoadingProjects && !isErrorProjects && projects.length === 0 && (
                    <Typography sx={{mt: 2, textAlign: 'center'}}>You don't have any projects yet. Click the '+' to
                        create one!</Typography>
                )}

                {!isLoadingProjects && !isErrorProjects && projects.length > 0 && (
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {projects.map((project) => (
                            <React.Fragment key={project._id}>
                                <ListItem
                                    alignItems="flex-start"
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="edit"
                                                    onClick={() => handleOpenEditProjectModal(project)}>
                                            <EditIcon/>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={project.name}
                                        secondary={
                                            <>
                                                <Typography sx={{display: 'inline'}} component="span" variant="body2"
                                                            color="text.primary">
                                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                                </Typography>
                                                {project.description && ` — ${project.description}`}
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li"/>
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
                        <Typography id="create-project-modal-title" variant="h6" component="h2">
                            Create New Project
                        </Typography>
                        <Box component="form" onSubmit={handleCreateProjectSubmit} noValidate sx={{mt: 2}}>
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
                                <CircularProgress size={24} sx={{display: 'block', margin: '10px auto'}}/>}
                            {openCreateProjectModal && isErrorProjects && messageProjects && (
                                <Alert severity="error" sx={{width: '100%', mt: 1}}
                                       onClose={() => dispatch(resetProjectStatus())}>
                                    {messageProjects}
                                </Alert>
                            )}
                            <Stack direction="row" spacing={2} sx={{mt: 3, justifyContent: 'flex-end'}}>
                                <Button onClick={handleCloseCreateProjectModal} color="inherit"
                                        disabled={isLoadingProjects}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" disabled={isLoadingProjects}>
                                    {isLoadingProjects ?
                                        <CircularProgress size={20} color="inherit"/> : 'Create Project'}
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
                            <Typography id="edit-project-modal-title" variant="h6" component="h2">
                                Edit Project
                            </Typography>
                            <Box component="form" onSubmit={handleEditProjectSubmit} noValidate sx={{mt: 2}}>
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
                                    <CircularProgress size={24} sx={{display: 'block', margin: '10px auto'}}/>}
                                {openEditProjectModal && isErrorProjects && messageProjects && (
                                    <Alert severity="error" sx={{width: '100%', mt: 1}}
                                           onClose={() => dispatch(resetProjectStatus())}>
                                        {messageProjects}
                                    </Alert>
                                )}
                                <Stack direction="row" spacing={2} sx={{mt: 3, justifyContent: 'flex-end'}}>
                                    <Button onClick={handleCloseEditProjectModal} color="inherit"
                                            disabled={isLoadingProjects}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={isLoadingProjects}>
                                        {isLoadingProjects ?
                                            <CircularProgress size={20} color="inherit"/> : 'Save Changes'}
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Modal>
                )}
            </Box>
        </Container>
    );
};

export default DashboardPage;