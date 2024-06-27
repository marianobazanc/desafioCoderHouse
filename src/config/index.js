import { connect } from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

export const objetConfig={
    port: process.env.PORT || 8080, 
    mongoUrl: process.env.DATABASE_URL, 
    jwt_private_key: process.env.JWT_SECRET_KEY
}
export const connectDB = () => {
    connect(objetConfig.mongoUrl);
    console.log('Base de datos conectada!');
};