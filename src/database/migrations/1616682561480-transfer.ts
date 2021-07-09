import { Column, MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class transfer1616682561480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {


        await queryRunner.createTable(new Table({
            name: "transfers",
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true
                },

                {
                    name: 'sender_id',
                    type: 'uuid',
                },
                {
                    name: 'receiver_id',
                    type: 'uuid',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },

            ],

        }));


    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transfers');
    }

}
