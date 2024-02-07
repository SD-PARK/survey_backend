import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SurveyResponse } from "../survey_response/survey_response.entity";
import { Choice } from "../choice/choice.entity";

@ObjectType()
@Entity('answers')
export class Answer {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ name: 'survey_response_id', type: 'int' })
    @Field(() => Int)
    surveyResponseId: number;

    @Column({ name: 'choice_id', type: 'int' })
    @Field(() => Int)
    choiceId: number;

    // Relations
    @ManyToOne(() => SurveyResponse, surveyResponse => surveyResponse.answers)
    @JoinColumn({ name: 'id' })
    surveyResponse: SurveyResponse;

    @ManyToOne(() => Choice, choice => choice.answers)
    @JoinColumn({ name: 'id' })
    choice: Choice;
}