import { loginToX } from './lib/x';
import dotenv from 'dotenv';

async function main() {
    dotenv.config();

    const nowDate = new Date();
    console.info('start.')
    
    const user = process.env.X_USER;
    const pass = process.env.X_PASS;
    if (!user || !pass) {
        console.error('X_USER or X_PASS is not defined.');
        return;
    }
    await loginToX(user, pass);
    
    console.info('end.')
}

main();
