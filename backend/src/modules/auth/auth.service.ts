import {
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import {LoginDto, RegisterDto} from "./dto/auth.dto";
import {SuccessResponse} from "../../common/interfaces/success-response";
import * as bcrypt from 'bcrypt';
import {successResponse} from "../../helpers";
import { JwtService } from '@nestjs/jwt';
import {User} from "../../entities/users/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async register(body: RegisterDto): Promise<SuccessResponse<{id: string, login: string, createdAt: Date}>> {
        const userExist = await this.userRepository.findOneBy({login: body.login});
        if (userExist) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword: string = await bcrypt.hash(body.password, 10);

        const user: User = this.userRepository.create({
            login: body.login,
            password: hashedPassword,
        })

        const { id, login, createdAt } = await this.userRepository.save(user)

        return successResponse({id, login, createdAt}, 'success')
    }

    async login(body: LoginDto): Promise<SuccessResponse<{ access_token: string, refresh_token: string }>> {
        const user = await this.userRepository.findOneBy({login: body.login});
        console.log(body)

        if (!user) {
            throw new UnprocessableEntityException('Invalid credentials');
        }
        const isPasswordMatch = await bcrypt.compare(body.password, user.password);
        if (!isPasswordMatch) {
            throw new UnprocessableEntityException('Invalid credentials');
        }
        const payload = { sub: user.id, login: user.login };

        const access_token = this.jwtService.sign({...payload, expiresIn: '1h'});
        const refresh_token = this.jwtService.sign({...payload, expiresIn: '7d'});

        user.refreshToken = await bcrypt.hash(refresh_token, 10);;
        await this.userRepository.save(user);

        return successResponse({access_token, refresh_token}, 'success')
    }

    async refresh(body: { refreshToken: string }): Promise<SuccessResponse<{ access_token: string }>> {
        const payload = this.jwtService.verify(body.refreshToken);

        const user: User | null = await this.userRepository.findOneBy({id: payload.sub});

        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access denied')
        }

        const isMatch = await bcrypt.compare(body.refreshToken, user.refreshToken);
        if (isMatch) {
            throw new ForbiddenException('Access denied')
        }

        const newAccessToken = await this.jwtService.sign({...payload, expiresIn: '1h'});

        return successResponse({access_token: newAccessToken}, 'success')
    }

    async logout(userId: string): Promise<SuccessResponse<string>> {
        await this.userRepository.update(userId, {refreshToken: null});
        return successResponse('Logged out', 'success')
    }
}
