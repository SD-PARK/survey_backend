import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guard/gql-auth.guard';
import { User } from '../user/user.entity';
import { CreateUserInput } from '../user/user.input';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Mutation(() => User)
    async signup(
        @Args('CreateUserInput') userInput: CreateUserInput,
    ) {
        return await this.authService.signup(userInput);
    }

    @Mutation(() => LoginResponse)
    @UseGuards(GqlAuthGuard)
    async login(
        @Args('loginInput') loginInput: LoginInput,
        @Context() context,
    ) {
        return await this.authService.login(context.user);
    }
}
