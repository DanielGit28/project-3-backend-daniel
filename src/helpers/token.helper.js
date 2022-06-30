import jwt from"jsonwebtoken";
import dotenv from"dotenv";

dotenv.config();
process.env.TOKEN_SECRET;

function tokenHelper(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '35min' });
}

export default tokenHelper;
    
