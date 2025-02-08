import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const token = request.cookies.token;
        const refreshToken = request.cookies.refreshToken;

        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { login: string };

            request.user = { login: decoded.login };

            return true;
        } catch (error) {
            console.log('❌ Invalid Token:', error.message);
        }

        try {
            const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { login: string };
            const newToken = jwt.sign({ login: decodedRefresh.login }, process.env.SECRET_KEY!, { expiresIn: '1h' });

            response.cookie('token', newToken, { httpOnly: true });
            request.user = { login: decodedRefresh.login };

            return true;
        } catch (error) {
            console.log('❌ Invalid Refresh Token:', error.message);
            throw new UnauthorizedException('Invalid token and refresh token');
        }
    }
}