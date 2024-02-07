import { Field, InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class CreateSurveyInput {
    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description?: string;
}

@InputType()
export class UpdateSurveyInput extends PartialType(CreateSurveyInput) {}