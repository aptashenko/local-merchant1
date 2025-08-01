import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/users/user.entity";
import {AuthModule} from "./modules/auth/auth.module";
import {UsersModule} from "./modules/users/users.module";
import {ServicesModule} from "./modules/services/services.module";
import {Service} from "./entities/services/service.entity";
import { ConfigModule } from '@nestjs/config';
//

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'a1111',
    password: '1111',
    database: 'locservice',
    entities: [User, Service],
    synchronize: true,
  }), AuthModule, UsersModule, ServicesModule]
})
export class AppModule {}
