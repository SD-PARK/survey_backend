import { Field, InputType, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class CreateAnswerInput {
    @Field(() => Int)
    surveyResponseId: number;

    @Field(() => Int)
    choiceId: number;
}

@InputType()
export class UpdateAnswerInput extends PartialType(CreateAnswerInput) {}