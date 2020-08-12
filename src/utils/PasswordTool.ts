import bcrypt from 'bcrypt';


async function hash(password: string) {
  const salt = await bcrypt.genSalt(10);

  const encryptedPassword = await bcrypt.hash(password, salt);

  return encryptedPassword;
}

async function compare(password:string, encrypted: string) {
  const match = await bcrypt.compare(password, encrypted);

  return match;
}

export default {
  hash,
  compare
}