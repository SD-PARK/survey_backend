import { Field, InputType, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class CreateSurveyResponseInput {
    @Field(() => Int)
    surveyId: number;

    @Field(() => Int)
    userId: number;

    @Field(() => Date, { nullable: true })
    completionDate?: Date;
}

@InputType()
export class UpdateSurveyResponseInput extends PartialType(CreateSurveyResponseInput) {}