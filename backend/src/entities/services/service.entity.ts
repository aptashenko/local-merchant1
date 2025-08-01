import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { ServiceCategory, ServiceCurrency } from './service.types';
import {User} from "../users/user.entity";

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'enum', enum: ServiceCurrency, default: ServiceCurrency.EUR })
    currency: ServiceCurrency

    @Column({ type: 'enum', enum: ServiceCategory })
    category: ServiceCategory

    @Column({ type: 'float' })
    price: number

    @Column({ type: 'text', array: true, default: [] })
    photos: string[];

    @Column({ type: 'float'})
    lat: number;

    @Column({ type: 'float'})
    lg: number;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;


    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // ✅ так работает в PostgreSQL
    createdAt: Date;
}
