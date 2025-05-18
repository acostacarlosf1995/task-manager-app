import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const DashboardPage = () => {
    return (
        <Container maxWidth="xs"> {/* Limita el ancho para un formulario de login */}
            <Box
                sx={{ // 'sx' es la prop para estilos directos en MUI, usa sintaxis CSS-in-JS
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Dashboard Page
                </Typography>
                {/* Aquí iría tu formulario de login más adelante */}
            </Box>
        </Container>
    );
};
export default DashboardPage;