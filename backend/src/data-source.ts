import { DataSource } from 'typeorm';
import { User } from './entities/users/user.entity';
import { Service } from './entities/services/service.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'a1111',
  password: '1111',
  database: 'locservice',
  entities: [User, Service],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
