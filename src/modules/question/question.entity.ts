import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Survey } from "../survey/survey.entity";
import { Choice } from "../choice/choice.entity";

@ObjectType()
@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ name: 'survey_id', type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    surveyId?: number;

    @Column({ type: 'text' })
    @Field(() => String)
    content: string;

    // Relations
    @ManyToOne(() => Survey, survey => survey.questions)
    @JoinColumn({ name: 'id' })
    survey: Survey;

    @OneToMany(() => Choice, choice => choice.question)
    choices: Choice[];
}