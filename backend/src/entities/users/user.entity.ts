import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    login: string;

    @Column()
    password: string;

    @Column({ type: 'text', nullable: true })
    refreshToken: string | null;

    @Column({ default: new Date() })
    createdAt: Date;
}
