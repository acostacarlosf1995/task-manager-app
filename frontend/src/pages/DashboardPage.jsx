import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {logout, reset as resetAuthStatus} from '../../src/features/auth/authSlice.js';
import {createProject, getProjects, resetProjectStatus} from '../features/projects/projectSlice.js';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import AddIcon from '@mui/icons-material/Add';

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

    const {user, isAuthenticated} = useSelector((state) => state.auth);

    const {
        projects,
        isLoading: isLoadingProjects,
        isError: isErrorProjects,
        isSuccess: isSuccessProjects,
        message: messageProjects,
    } = useSelector((state) => state.project);

    useEffect(() => {
        if (isErrorProjects && messageProjects) {
            console.error('Error fetching projects:', messageProjects);
        }
        if (isAuthenticated) {
            dispatch(getProjects());
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        // console.log(`[Create Project Effect] isSuccessProjects: ${isSuccessProjects}, isLoading: ${isLoadingProjects}`);
        if (isSuccessProjects && !isLoadingProjects) {
            handleCloseCreateProjectModal();
        }
    }, [isSuccessProjects, isLoadingProjects, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetAuthStatus());
        dispatch(resetProjectStatus());
        navigate('/login');
    };

    const handleOpenCreateProjectModal = () => {
        dispatch(resetProjectStatus()); // Resetear antes de abrir para limpiar estados previos
        setNewProjectData({ name: '', description: '' }); // Limpiar formulario
        setOpenCreateProjectModal(true);
    };

    const handleCloseCreateProjectModal = () => {
        setOpenCreateProjectModal(false);
        setNewProjectData({ name: '', description: '' });
        dispatch(resetProjectStatus()); // Crucial: resetea isLoading, isSuccess, isError, message del slice de proyecto
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

    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center', No siempre queremos centrar todo el contenido del dashboard
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

                {isErrorProjects && messageProjects && (
                    <Alert severity="error" sx={{width: '100%', mt: 2}}>
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
                                    button="true"
                                    // onClick={() => navigate(`/projects/${project._id}`)}
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
                    aria-describedby="create-project-modal-description"
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
                            {isErrorProjects && messageProjects && (
                                <Alert severity="error" sx={{width: '100%', mt: 1}}>
                                    {messageProjects}
                                </Alert>
                            )}
                            <Stack direction="row" spacing={2} sx={{mt: 3, justifyContent: 'flex-end'}}>
                                <Button onClick={handleCloseCreateProjectModal} color="inherit">
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
            </Box>
        </Container>
    );
};

export default DashboardPage;