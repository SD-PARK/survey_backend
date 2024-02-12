import { Field, ObjectType, Int } from "@nestjs/graphql";
import { User } from "../../user/user.entity";

@ObjectType()
export class LoginResponse {
    @Field()
    access_token: string;

    @Field(() => User)
    user: User;
}