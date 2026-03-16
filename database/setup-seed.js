// This script generates a bcrypt hash for the default password and updates the schema.sql file with the correct hash.
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate the bcrypt hash and update schema.sql
async function generateSeed() {
  const password = 'P@$$w0rd!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Print the generated hash for verification
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('');

  // Read schema.sql and replace placeholder hash
  const schemaPath = path.join(__dirname, 'schema.sql');
  let schema = fs.readFileSync(schemaPath, 'utf-8');

  // Replace all instances of the placeholder hash
  const placeholderHash = '$2a$10$xPBm0dEqJGHLMfWxOe0tYeWbYRdN.qFz5GkLMV1Lk7mQ5xQFqJ5S6';
  schema = schema.replaceAll(placeholderHash, hash);

  // Write the updated schema back to file
  fs.writeFileSync(schemaPath, schema, 'utf-8');
  console.log('schema.sql updated with correct bcrypt hash!');
  console.log('Now run: psql -d lf_cybersecurity -f database/schema.sql');
}
// Run the seed generation
generateSeed().catch(console.error);
