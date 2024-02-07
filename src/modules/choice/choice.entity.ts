import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../question/question.entity";
import { Answer } from "../answer/answer.entity";

@ObjectType()
@Entity('choices')
export class Choice {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({ name: 'question_id', type: 'int', nullable: true })
    @Field(() => Int, { nullable: true })
    questionId?: number;

    @Column({ type: 'text' })
    @Field(() => String)
    content: string;

    @Column({ type: 'int' })
    @Field(() => Int)
    score: number;

    // Relations
    @ManyToOne(() => Question, question => question.choices)
    @JoinColumn({ name: 'id' })
    question: Question;

    @OneToMany(() => Answer, answer => answer.choice)
    answers: Answer[];
}