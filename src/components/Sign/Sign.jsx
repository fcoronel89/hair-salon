import SectionContainer from '../UI/SectionContainer'
import { IconButton, Typography, useMediaQuery } from '@mui/material'
import { apiUrl } from '../../utils/helpers'
import './Sign.scss'

const Sign = ({title}) => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  return (
    <SectionContainer cssClasses="sign">
      <Typography variant={isNonMobile ? "h2" : "h3"} mb={isNonMobile ? 5 : 3}>
        {title}
      </Typography>
      <IconButton
        href={`${apiUrl}/auth/google`}
        size={isNonMobile ? "medium" : "small"}
        aria-label="google"
      >
        <img
          src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
          alt="Google"
        />
        Entrar con google
      </IconButton>
    </SectionContainer>
  )
}

export default Sign