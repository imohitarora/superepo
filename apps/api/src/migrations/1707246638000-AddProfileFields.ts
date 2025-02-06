import { MigrationInterface, QueryRunner } from "typeorm"

export class AddProfileFields1707246638000 implements MigrationInterface {
    name = 'AddProfileFields1707246638000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "name" character varying,
            ADD COLUMN "bio" text,
            ADD COLUMN "avatar_url" character varying
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "name",
            DROP COLUMN "bio",
            DROP COLUMN "avatar_url"
        `)
    }
}
