import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../user/user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        try {
            const user: User = await this.userService.getUserEmailForce(email);

            if (!user)
                throw new ForbiddenException('인증 실패: 등록되지 않은 사용자입니다.');
            else if (!(await bcrypt.compare(password, user?.password))) {
                throw new ForbiddenException('인증 실패: 비밀번호가 일치하지 않습니다.');
            } else {
                const { password, ...result } = user;
                return result;
            }
        } catch (err) {
            if (err.status == 403 || err.status == 404)
                throw err;
            else
                throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async login(user: User) {
        return {
            access_token: this.jwtService.sign({
                email: user.email,
                sub: user.id,
            }),
            user: user,
        };
    }

    async signup(userInput: CreateUserInput): Promise<User> {
        const password = await bcrypt.hash(userInput.password, 10);
        return await this.userService.createUser({
            ...userInput,
            password,
        });
    }
}
