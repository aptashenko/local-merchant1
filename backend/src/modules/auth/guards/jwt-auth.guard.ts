import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException('Missing or invalid token')
        }
        const token = authHeader.split(' ')[1];
        try {
            request['user'] = await this.jwtService.verifyAsync(token);
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
