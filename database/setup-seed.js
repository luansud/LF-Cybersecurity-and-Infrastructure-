/**
 * Setup Script — Run once after npm install to generate
 * correct bcrypt hashes for seed data in schema.sql
 *
 * Usage: node database/setup-seed.js
 */
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSeed() {
  const password = 'P@$$w0rd!';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('');

  // Read schema.sql and replace placeholder hash
  const schemaPath = path.join(__dirname, 'schema.sql');
  let schema = fs.readFileSync(schemaPath, 'utf-8');

  // Replace all instances of the placeholder hash
  const placeholderHash = '$2a$10$xPBm0dEqJGHLMfWxOe0tYeWbYRdN.qFz5GkLMV1Lk7mQ5xQFqJ5S6';
  schema = schema.replaceAll(placeholderHash, hash);

  fs.writeFileSync(schemaPath, schema, 'utf-8');
  console.log('schema.sql updated with correct bcrypt hash!');
  console.log('Now run: psql -d lf_cybersecurity -f database/schema.sql');
}

generateSeed().catch(console.error);
