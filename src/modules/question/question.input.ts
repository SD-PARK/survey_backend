import { Field, InputType, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class CreateQuestionInput {
    @Field(() => Int, { nullable: true })
    surveyId?: number;

    @Field(() => String)
    content: string;
}

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {}