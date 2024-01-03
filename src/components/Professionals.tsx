import { Link, useNavigate } from "react-router-dom";
import { Professional } from "../models/professional";
import { useQuery } from "@tanstack/react-query";

import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import './Professionals.scss';

const Professionals = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: professionals } = useQuery<Professional[]>({
    queryKey: ["professionals"],
  });

  const handleRedirect = (id: string): void => {
    navigate(`/profesionales/editar/${id}`);
  };

  const renderProfessionals = (): JSX.Element => {
    return (
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow
              sx={{
                "&:last-child th": { fontSize: "1rem", fontWeight: "bold" },
              }}
            >
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professionals &&
              professionals.map((professional) => (
                <TableRow
                  key={professional._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Avatar
                      src={professional.image}
                      alt={`${professional.firstName} ${professional.lastName}`}
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{professional.firstName}</TableCell>
                  <TableCell>{professional.lastName}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      aria-label="edit"
                      onClick={() => handleRedirect(professional._id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Typography variant="h3" component="h1" mb={5}>
        Listado de Profesionales
      </Typography>
      <Box display="flex" justifyContent="flex-end" mt={2} className="button-box">
        <Link to="/profesionales/crear">
          <IconButton
            size="medium"
            aria-label="add"
            color="primary"
            sx={{
              backgroundColor: "secondary.main",
              "&:hover": { backgroundColor: "secondary.dark" },
            }}
          >
            Crear Profesional
          </IconButton>
        </Link>
      </Box>

      {renderProfessionals()}
    </>
  );
};

export default Professionals;
