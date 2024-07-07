import Button from './Button'
import { FaGoogle } from 'react-icons/fa'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useMutation } from '@tanstack/react-query'
import * as apiClient from '../api-client'
import { useAppDispatch } from '../store'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../slices/authSlice'
import { app } from '../globalInstance/firebase'
import { toast } from 'react-toastify'
import confetti from 'canvas-confetti'

const OAuthButton = () => {
  const auth = getAuth(app)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const googleAuthMutation = useMutation({
    mutationFn: apiClient.googleSignIn,
    retry: false,
    onSuccess: async (data) => {
      dispatch(setCredentials(data))
      navigate('/')
      toast(`🎉 Welcome onboard ${data.firstName}`)
      confetti({
        particleCount: 200,
        spread: 120,
        gravity: 0.75,
      })
    },
    onError: async (err: Error) => {
      toast.error(err.message)
    },
  })

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    const resultsFromGoogle = await signInWithPopup(auth, provider)
    const { displayName, email } = resultsFromGoogle.user

    let firstName = ''
    let lastName = ''

    // If displayName doesn't contain lastName then
    if (displayName) {
      if (displayName.split(' ').length === 1) {
        firstName = displayName
      } else {
        const [googleFirstName, googleLastName] = displayName.split(' ')
        firstName = googleFirstName
        lastName = googleLastName
      }
    }

    googleAuthMutation.mutate({ email, firstName, lastName })
  }

  return (
    <Button type="button" icon={FaGoogle} onClick={handleGoogleClick}>
      Sign in with Google
    </Button>
  )
}

export default OAuthButton
