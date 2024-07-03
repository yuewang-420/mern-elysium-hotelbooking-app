import { RegFormData } from './pages/user/Register'
import { SignInFormData } from './pages/user/SignIn'
import { ForgotPasswordFormData } from './pages/user/ForgotPassword'
import { UpdateProfileFormData } from './pages/user/PersonalDetails'
import { HotelType, HotelSearchResponse } from '../../backend/src/shared/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class FetchError extends Error {
  public body: any

  constructor(message: string, body: any) {
    super(message)
    this.body = body
  }
}

export const register = async (data: RegFormData) => {
  const { confirmPassword, ...restData } = data

  const res = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(restData),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new Error(errMessage)
    } else {
      throw new Error(errMessage.join(' '))
    }
  }

  return body
}

export const sendVerifyEmail = async (data: { email: string }) => {
  const res = await fetch(`${API_BASE_URL}/api/users/email`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new Error(errMessage)
    } else {
      throw new Error(errMessage.join(' '))
    }
  }

  return body
}

export const verifyEmail = async (data: { token: string }) => {
  const res = await fetch(`${API_BASE_URL}/api/users/email/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new FetchError(errMessage, body)
    } else {
      throw new FetchError(errMessage.join(' '), body)
    }
  }

  return body
}

export const signIn = async (data: SignInFormData) => {
  const res = await fetch(`${API_BASE_URL}/api/users/auth`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new Error(errMessage)
    } else {
      throw new Error(errMessage.join(' '))
    }
  }

  return body
}

export const googleSignIn = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/api/users/auth/google`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new Error(errMessage)
    } else {
      throw new Error(errMessage.join(' '))
    }
  }

  return body
}

export const signOut = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}

export const requestPasswordResetLink = async (
  data: ForgotPasswordFormData
) => {
  const res = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new Error(errMessage)
    } else {
      throw new Error(errMessage.join(' '))
    }
  }

  return body
}

export const verifyResetLink = async (data: { token: string }) => {
  const res = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new FetchError(errMessage, body)
    } else {
      throw new FetchError(errMessage.join(' '), body)
    }
  }

  return body
}

export const resetPassword = async (data: {
  email: string
  prevPassword: string
  otp: string
  password: string
}) => {
  const res = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new Error(errMessage)
    } else {
      throw new Error(errMessage.join(' '))
    }
  }

  return body
}

// Not completed feature
export const getProfile = async () => {
  const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'GET',
    credentials: 'include',
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}

export const updateProfile = async (data: UpdateProfileFormData) => {
  const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}

export const addNewHotel = async (
  addHotelFormData: FormData
): Promise<HotelType> => {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels/`, {
    method: 'POST',
    credentials: 'include',
    body: addHotelFormData,
  })

  const body = await res.json()

  if (!res.ok) {
    const errMessage = body.message
    if (typeof errMessage === 'string') {
      throw new Error(errMessage)
    } else {
      throw new Error(errMessage.join(' '))
    }
  }

  return body
}

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels/`, {
    method: 'GET',
    credentials: 'include',
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const res = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: 'GET',
    credentials: 'include',
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}

export const updateMyHotelById = async (
  updateHotelFormData: FormData
): Promise<HotelType> => {
  const res = await fetch(
    `${API_BASE_URL}/api/my-hotels/${updateHotelFormData.get('hotelId')}`,
    {
      method: 'put',
      credentials: 'include',
      body: updateHotelFormData,
    }
  )

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}

export const getSearchHotels = async (
  searchParams: URLSearchParams
): Promise<HotelSearchResponse> => {
  const res = await fetch(
    `${API_BASE_URL}/api/hotels/search?${searchParams.toString()}`
  )

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const res = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
    method: 'GET',
    credentials: 'include',
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.message)
  }

  return body
}
