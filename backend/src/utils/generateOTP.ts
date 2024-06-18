import randomstring from 'randomstring'

const generateOTP = (): string => {
  return randomstring.generate({ length: 6, charset: 'numeric' })
}

export default generateOTP
