import { Box, CircularProgress } from "@mui/material"
import './Loading.scss'

const Loading = () => {
  return (
    <Box className="loading">
        <CircularProgress size={50} color="secondary" />
        <p>Cargando</p>
    </Box>
  )
}

export default Loading