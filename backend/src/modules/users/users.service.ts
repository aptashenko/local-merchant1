import {ConflictException, Injectable} from "@nestjs/common";
import {User} from "../../entities/users/user.entity";
import {SuccessResponse} from "../../common/interfaces/success-response";
import {successResponse} from "../../helpers";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
    }

    async getProfile(userId: string): Promise<SuccessResponse<{ id: string, login: string, createdAt: Date }>> {
        const user: User | null = await this.userRepository.findOneBy({id: userId});
        if (!user) {
            throw new ConflictException('User not found');
        }

        return successResponse({
            id: user.id,
            login: user.login,
            createdAt: user.createdAt
        }, 'success')
    }
}
