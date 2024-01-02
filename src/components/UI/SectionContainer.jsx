import { Box } from "@mui/material";

const SectionContainer = ({ children, cssClasses = "" }) => {
  const combinedClasses = `section-container ${cssClasses || ""}`;
  return (
    <Box
      className={combinedClasses}
      component="section"
      width={"70%"}
      mx={"auto"}
      mt={2}
      p={2}
      position={"relative"}
      minHeight={"calc(100% - 16px)"}
    >
      {children}
    </Box>
  );
};

export default SectionContainer;
