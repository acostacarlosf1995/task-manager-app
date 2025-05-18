import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const LoginPage = () => {
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
                    Login Page
                </Typography>
            </Box>
        </Container>
    );
};
export default LoginPage;