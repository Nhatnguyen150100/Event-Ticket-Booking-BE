function generateRandomPassword(length) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';
  
  const allCharacters = lowercase + uppercase + numbers + specialCharacters;
  
  if (length < 8) {
      throw new Error('Password length should be at least 8 characters.');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      password += allCharacters[randomIndex];
  }

  return password;
}

export default generateRandomPassword;