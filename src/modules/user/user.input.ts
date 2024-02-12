import { Field, InputType, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Boolean, { nullable: true })
    gender?: boolean;

    @Field(() => Int, { nullable: true })
    age?: number;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}