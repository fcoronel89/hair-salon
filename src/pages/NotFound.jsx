import { Box, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={0.5}
      alignItems={"center"}
      height={"100vh"}
      justifyContent={"center"}
    >
      <Typography variant="h2" component="h2" mb={1}>
        404 Pagina no encontrada
      </Typography>
      <Typography variant="body1" component="p">
        La pagina que tratas de acceder no existe
      </Typography>
    </Box>
  );
};

export default NotFoundPage;
