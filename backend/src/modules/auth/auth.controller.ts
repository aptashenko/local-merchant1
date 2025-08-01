import {Body, Post, Controller, Req, UseGuards, Get} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {LoginDto, RegisterDto} from "./dto/auth.dto";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body)
    }
    @Post('signin')
    login(@Body() body: LoginDto) {
        return this.authService.login(body)
    }
    @Post('refresh')
    refresh(@Body() body: {refreshToken: string}) {
        return this.authService.refresh(body)
    }
    @Get('logout')
    @UseGuards(JwtAuthGuard)
    logout(@Req() req) {
        return this.authService.logout(req.user.sub);
    }
}
