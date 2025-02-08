import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export const generateVerificationCode = (): string => {
    return crypto.randomBytes(4).toString('hex');
};

export const sendConfirmationEmail = async (email: string, code: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_LOGiN,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    console.log(email, code);

    const mailOptions = {
        from: process.env.GMAIL_LOGiN,
        to: email,
        subject: 'Confirmation code',
        text: `Your confirmation code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};

export const createTokens = (login: string): { token: string, refreshToken: string } => {
    const token = jwt.sign({ login }, process.env.SECRET_KEY!, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ login }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

    return { token, refreshToken };
}