import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../question/question.entity";
import { SurveyResponse } from "../survey_response/survey_response.entity";

@ObjectType()
@Entity('surveys')
export class Survey {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ type: 'text' })
    @Field(() => String)
    title: string;

    @Column({ type: 'text', nullable: true })
    @Field(() => String, { nullable: true })
    description?: string;

    // Relations
    @OneToMany(() => Question, question => question.survey)
    questions: Question[];

    @OneToMany(() => SurveyResponse, surveyResponse => surveyResponse.survey)
    surveyResponses: SurveyResponse[];
}