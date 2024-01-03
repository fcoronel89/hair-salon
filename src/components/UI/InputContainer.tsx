import { Box } from "@mui/material";
import './InputContainer.scss';

const InputContainer = ({ children, cssClasses= '' }: { children: React.ReactNode, cssClasses?: string }) => {
  const combinedClasses = `input-container ${cssClasses || ""}`;

  return (
    <Box className={combinedClasses}>
      {children}
    </Box>
  );
};

export default InputContainer;
