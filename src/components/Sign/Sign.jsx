import SectionContainer from '../UI/SectionContainer'
import { IconButton, Typography } from '@mui/material'
import { apiUrl } from '../../utils/helpers'
import './Sign.scss'

const Sign = ({title}) => {
  return (
    <SectionContainer cssClasses="sign">
      <Typography variant="h2" mb={5}>
        {title}
      </Typography>
      <IconButton
        href={`${apiUrl}/auth/google`}
        size="medium"
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