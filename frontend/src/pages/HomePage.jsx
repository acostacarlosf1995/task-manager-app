import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupIcon from '@mui/icons-material/Group';
import PaletteIcon from '@mui/icons-material/Palette';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const featureCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.5,
            ease: "easeOut"
        }
    }),
};


const HomePage = () => {
    const theme = useTheme();

    const features = [
        {
            icon: <AccountTreeIcon fontSize="large" color="primary" />,
            title: 'Intuitive Project Management',
            description: 'Easily create and organize your projects, assign tasks, and track their progress.',
        },
        {
            icon: <CheckCircleOutlineIcon fontSize="large" color="primary" />,
            title: 'Flexible Kanban Board',
            description: 'Visualize your tasks in customizable columns and move them with drag-and-drop.',
        },
        {
            icon: <PaletteIcon fontSize="large" color="primary" />,
            title: 'Light and Dark Theme',
            description: 'Adapt the interface to your visual preferences with a single click.',
        },
        {
            icon: <GroupIcon fontSize="large" color="primary" />,
            title: 'Focused on Your Productivity',
            description: 'A clean interface and straightforward tools so you can focus on what matters.',
        },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', color: 'text.primary', overflowX: 'hidden' }}>
            <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{
                    minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: { xs: 4, md: 8 },
                    px: 2,
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        component={motion.h1}
                        variants={itemVariants}
                        variant="h2"
                        gutterBottom
                        sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}
                    >
                        CTaskManager
                    </Typography>
                    <Typography
                        component={motion.h2}
                        variants={itemVariants}
                        variant="h4"
                        color="text.secondary"
                        gutterBottom
                        sx={{ mb: 1, fontWeight: 500 }}
                    >
                        Organize your Workflow, Achieve your Goals.
                    </Typography>
                    <Typography
                        component={motion.p}
                        variants={itemVariants}
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 4, maxWidth: '700px', margin: '0 auto 32px auto' }}
                    >
                        Simplify your project and task management with an intuitive interface and powerful tools.
                    </Typography>
                    <Box component={motion.div} variants={itemVariants}>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontSize: '1.1rem',
                                borderRadius: theme.shape.borderRadius,
                                boxShadow: theme.shadows[4]
                            }}
                        >
                            Start for Free
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container sx={{ py: { xs: 6, md: 10 } }} maxWidth="lg">
                <Typography
                    component={motion.h2}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    variant="h3"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold', mb: 6 }}
                >
                    Everything you need, and nothing more.
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                variants={featureCardVariants}
                            >
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        bgcolor: 'background.paper',
                                        borderRadius: '12px'
                                    }}
                                >
                                    <Box sx={{ mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
                <Box textAlign="center" sx={{ mt: 6 }}>
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}>
                        <Button
                            component={RouterLink}
                            to="/dashboard"
                            variant="outlined"
                            color="primary"
                            size="large"
                        >
                            Explore the App
                        </Button>
                    </motion.div>
                </Box>
            </Container>

            <Box component="footer" sx={{ bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200], py: 3, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} CTaskManager. All rights reserved.
                    </Typography>
                    {/* enlace a mi portafolio pendiente */}
                </Container>
            </Box>
        </Box>
    );
};

export default HomePage;