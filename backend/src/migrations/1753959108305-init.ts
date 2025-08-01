import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753959108305 implements MigrationInterface {
    name = 'Init1753959108305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '"2025-07-31T10:51:50.129Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-07-31 10:51:35.344'`);
    }

}
