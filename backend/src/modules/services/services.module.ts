import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../../entities/users/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {ServicesService} from "./services.service";
import {ServicesController} from "./services.controller";
import {Service} from "../../entities/services/service.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Service]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [ServicesService],
    controllers: [ServicesController],
})

export class ServicesModule {}
