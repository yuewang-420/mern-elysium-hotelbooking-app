// Helper function to capitalize the first letter of each word
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()
}

export default capitalize
