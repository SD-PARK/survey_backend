import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    // Create

    // Read
    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async getUserId(@Args('id') id: number): Promise<User> {
        return this.userService.getUserId(id);
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async getUserEmail(@Args('email') email: string): Promise<User> {
        return this.userService.getUserEmail(email);
    }
    
    @Query(() => [User])
    @UseGuards(JwtAuthGuard)
    async getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    // Update

    // Delete
}
