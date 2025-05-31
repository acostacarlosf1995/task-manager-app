import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {motion} from 'framer-motion';

const heroVariants = {
    hidden: {opacity: 0, y: 50},
    visible: {opacity: 1, y: 0, transition: {duration: 0.8, ease: "easeOut"}},
};

const HomePage = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: 'background.default',
                color: 'text.primary',
            }}
        >
            <Container maxWidth="md">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                >
                    <Typography
                        component="h1"
                        variant="h2"
                        gutterBottom
                        sx={{fontWeight: 'bold', mb: 3}}
                    >
                        Organiza tu Vida, Domina tus Tareas.
                    </Typography>
                    <Typography
                        variant="h5"
                        component="p"
                        sx={{mb: 4}}
                    >
                        Simplifica tu gestión de proyectos y tareas con nuestra intuitiva aplicación.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{mt: 2}}
                        href="/register"
                    >
                        ¡Empieza Ahora!
                    </Button>
                </motion.div>
            </Container>
        </Box>
    );
};

export default HomePage;