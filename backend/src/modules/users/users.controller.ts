import {Controller, Get, Req, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UsersService} from "./users.service";
import {SuccessResponse} from "../../common/interfaces/success-response";
import {User} from "../../entities/users/user.entity";

@Controller('profile')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }
    @Get()
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req): Promise<SuccessResponse<{ id: string, login: string, createdAt: Date }>> {
        return this.usersService.getProfile(req.user.sub);
    }
}
