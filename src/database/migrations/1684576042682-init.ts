import { MigrationInterface, QueryRunner } from 'typeorm';
import { encryptPassword } from "@common/helper";
import { Role } from "@module/auth/enum/roles.enum";

export class init1684576042682 implements MigrationInterface {
  name = 'init1684576042682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password\` longtext NULL, \`mobile\` varchar(10) NULL, \`address\` longtext NULL, \`roles\` varchar(255) DEFAULT \'${Role.User}\', \`avatar\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_2d4a15c7f8b3864a5465fb687e\` (\`name\`, \`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auth_access_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`access_token_id\` longtext NOT NULL, \`user_id\` int NOT NULL, \`revoke\` tinyint NOT NULL DEFAULT '0', \`expired_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auth_access_token\` ADD CONSTRAINT \`FK_00568545bb5a0932aa53a3993de\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    const password = await encryptPassword('password');

    await queryRunner.query(`insert into users (\`name\`, \`email\`, \`password\`, \`roles\`) values ('admin', 'admin@admin.com', '${password}', '${Role.Admin}')`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auth_access_token\` DROP FOREIGN KEY \`FK_00568545bb5a0932aa53a3993de\``,
    );
    await queryRunner.query(`DROP TABLE \`auth_access_token\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2d4a15c7f8b3864a5465fb687e\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
