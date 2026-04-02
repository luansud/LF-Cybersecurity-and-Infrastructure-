// Utility to generate a bcrypt hash for the seed password
import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'P@$$w0rd!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nCopy this hash into schema.sql for the seed users.');
}

generateHash().catch(console.error);
