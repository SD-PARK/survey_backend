import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ type: 'varchar', unique: true, length: 320 })
    @Field(() => String)
    email: string;

    @Column({ type: 'varchar', length: 255 })
    @Field(() => String, { nullable: true })
    password?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    @Field(() => String, { nullable: true })
    name?: string;

    @Column({ type: 'boolean', nullable: true })
    @Field(() => Boolean, { nullable: true })
    gender?: boolean;

    @Column({ type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    age?: number;
}