import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTenantsAndInvitations1707177600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create tenants table
        await queryRunner.createTable(
            new Table({
                name: 'tenants',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '50',
                        default: "'active'",
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Create invitations table
        await queryRunner.createTable(
            new Table({
                name: 'invitations',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        length: '36',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '50',
                        default: "'pending'",
                    },
                    {
                        name: 'tenant_id',
                        type: 'varchar',
                        length: '36',
                    },
                    {
                        name: 'inviter_id',
                        type: 'varchar',
                        length: '36',
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Add tenant_id and roles to users table
        await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN tenant_id VARCHAR(36),
            ADD COLUMN roles JSON,
            ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);

        // Set default roles for existing users
        await queryRunner.query(`
            UPDATE users 
            SET roles = JSON_ARRAY('user')
            WHERE roles IS NULL
        `);

        // Add foreign keys
        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                columnNames: ['tenant_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tenants',
                onDelete: 'SET NULL',
            }),
        );

        await queryRunner.createForeignKey(
            'invitations',
            new TableForeignKey({
                columnNames: ['tenant_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tenants',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'invitations',
            new TableForeignKey({
                columnNames: ['inviter_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        const invitationsTable = await queryRunner.getTable('invitations');
        const usersTable = await queryRunner.getTable('users');
        
        // Safely drop foreign keys if tables exist
        if (invitationsTable) {
            const invitationForeignKeys = invitationsTable.foreignKeys;
            await Promise.all(
                invitationForeignKeys.map(key => queryRunner.dropForeignKey('invitations', key))
            );
        }

        if (usersTable) {
            const usersForeignKeys = usersTable.foreignKeys;
            await Promise.all(
                usersForeignKeys.map(key => queryRunner.dropForeignKey('users', key))
            );
        }

        // Drop columns from users table
        await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN tenant_id,
            DROP COLUMN roles,
            DROP COLUMN updated_at
        `);

        // Drop tables
        await queryRunner.dropTable('invitations');
        await queryRunner.dropTable('tenants');
    }
}
