import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Survey } from "../survey/survey.entity";
import { Answer } from "../answer/answer.entity";

@ObjectType()
@Entity('survey_responses')
export class SurveyResponse {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ name: 'survey_id', type: 'int' })
    @Field(() => Int)
    surveyId: number;

    @Column({ name: 'user_id', type: 'int' })
    @Field(() => Int)
    userId: number;

    @Column({ name: 'completion_date', type: 'timestamp', nullable: true })
    @Field(() => Date, { nullable: true })
    completionDate?: Date;

    @Field(() => Int, { defaultValue: 0 })
    score?: number;

    // Relations
    @ManyToOne(() => Survey, survey => survey.surveyResponses)
    @JoinColumn({ name: 'id' })
    survey: Survey;

    @OneToMany(() => Answer, answer => answer.surveyResponse)
    answers: Answer[];
}