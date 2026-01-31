import { Typography, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { FE_ROUTES } from '@shared/constants'
import styles from './NotFoundPage.module.css'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate(FE_ROUTES.HOME)
  }

  return (
    <Container maxWidth='sm'>
      <div className={styles.container}>
        <ErrorOutlineIcon className={styles.icon} />

        <Typography variant='h1' component='h1' className={styles.title}>
          404
        </Typography>

        <Typography variant='h5' color='text.secondary' className={styles.subtitle}>
          Page Not Found
        </Typography>

        <Typography variant='body1' color='text.secondary' className={styles.description}>
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </Typography>

        <Button
          variant='contained'
          size='large'
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
          className={styles.button}
        >
          Go to Home Page
        </Button>
      </div>
    </Container>
  )
}
