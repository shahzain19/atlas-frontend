import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'atlas.db');
console.log('Inspecting DB at:', dbPath);

const db = new Database(dbPath);

try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Existing Tables:', tables.map(t => t.name));

    if (tables.some(t => t.name === 'users')) {
        const users = db.prepare('SELECT id, username FROM users').all();
        console.log('Current Users:', users);
    } else {
        console.log('Table "users" does NOT exist!');
    }

    // Test bcrypt
    const testPass = 'password123';
    const hash = await bcrypt.hash(testPass, 10);
    const match = await bcrypt.compare(testPass, hash);
    console.log('Bcrypt Test:', match ? 'SUCCESS' : 'FAILURE');

} catch (err) {
    console.error('Debug Error:', err.message);
} finally {
    db.close();
}
