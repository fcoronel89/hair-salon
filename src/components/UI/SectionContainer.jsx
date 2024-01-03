import { Box } from "@mui/material";
import './SectionContainer.scss';

const SectionContainer = ({ children, cssClasses = "" }) => {
  const combinedClasses = `section-container ${cssClasses || ""}`;
  return (
    <Box
      className={combinedClasses}
      component="section"
    >
      {children}
    </Box>
  );
};

export default SectionContainer;
