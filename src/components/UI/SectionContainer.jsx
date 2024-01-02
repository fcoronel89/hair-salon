import { Box } from "@mui/material";

const SectionContainer = ({ children, cssClasses = "" }) => {
  const combinedClasses = `section-container ${cssClasses || ""}`;
  return (
    <Box
      className={combinedClasses}
      component="section"
      width={"60%"}
      mx={"auto"}
      mt={2}
      maxWidth={"50rem"}
      p={2}
    >
      {children}
    </Box>
  );
};

export default SectionContainer;
