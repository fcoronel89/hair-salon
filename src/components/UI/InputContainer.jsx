import { Box } from "@mui/material";
import './InputContainer.scss';

const InputContainer = ({ children, cssClasses= '' }) => {
  const combinedClasses = `input-container ${cssClasses || ""}`;

  return (
    <Box className={combinedClasses}>
      {children}
    </Box>
  );
};

export default InputContainer;
