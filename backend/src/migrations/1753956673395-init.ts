import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753956673395 implements MigrationInterface {
    name = 'Init1753956673395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '"2025-07-31T10:11:14.999Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "createdAt" SET DEFAULT '2025-07-31 10:11:10.886'`);
    }

}
