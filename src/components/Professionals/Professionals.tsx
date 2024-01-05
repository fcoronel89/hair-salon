import { Link } from "react-router-dom";
import { Professional } from "../../models/professional";
import { useQuery } from "@tanstack/react-query";

import { Box, IconButton, Typography } from "@mui/material";
import "./Professionals.scss";
import ProfessionalsGrid from "./ProfessionalsGrid";

const Professionals = (): JSX.Element => {
  const { data: professionals } = useQuery<Professional[]>({
    queryKey: ["professionals"],
  });

  return (
    <>
      <Typography variant="h3" component="h1" mb={5}>
        Listado de Profesionales
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-end"
        mt={2}
        className="button-box"
      >
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
      {professionals && professionals.length && (
        <ProfessionalsGrid professionals={professionals} />
      )}
    </>
  );
};

export default Professionals;
