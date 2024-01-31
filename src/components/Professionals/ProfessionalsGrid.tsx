import { useNavigate } from "react-router-dom";
import { Professional } from "../../models/professional";

import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./Professionals.scss";
const ProfessionalsGrid = ({
  professionals,
}: {
  professionals: Professional[];
}) => {
  const navigate = useNavigate();

  const handleRedirect = (id: string): void => {
    navigate(`/profesionales/editar/${id}`);
  };

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
                    src={professional.image.toString()}
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
                    color="secondary"
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

export default ProfessionalsGrid;
