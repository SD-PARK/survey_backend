import { ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from './user.input';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}
    private readonly logger: Logger = new Logger(UserService.name);

    // Create
    async createUser(userInput: CreateUserInput): Promise<User> {
        try {
            if (this.getUserEmailForce(userInput.email))
                throw new ConflictException('해당 이메일은 이미 존재합니다.');
            
            const newUser: User = this.userRepository.create(userInput);
            return await this.userRepository.save(newUser);
        } catch (err) {
            if (err.status == 409)
                throw err;
            else
                throw new Error(`Unexpected error: ${err.message}`);
        }
    }
    
    // Read
    async getUserId(id: number): Promise<User> {
        try {
            const result: User = await this.userRepository.findOne({ where: { id: id }});

            if (result === null)
                throw new NotFoundException(`ID: ${id}에 해당하는 항목을 찾을 수 없습니다.`);
            else {
                const { password, ...user } = result;
                return user;
            }
        } catch (err) {
            if (err.status == 404)
                throw err;
            else
                throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getUserEmail(email: string): Promise<User> {
        try {
            const result: User = await this.userRepository.findOne({ where: { email: email }});

            if (result === null)
                throw new NotFoundException(`Email: ${email}에 해당하는 항목을 찾을 수 없습니다.`);
            else {
                const { password, ...user } = result;
                return user;
            }
        } catch (err) {
            if (err.status == 404)
                throw err;
            else
                throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getUserEmailForce(email: string): Promise<User> {
        try {
            const result: User = await this.userRepository.findOne({ where: { email: email }});
            return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getUsers(): Promise<User[]> {
        try {
            const result: User[] = await this.userRepository.find();
            const users: User[] = result.map((user) => {
                const { password, ...result } = user;
                return result;
            });
            return users;
        } catch (err) {
            if (err.status == 404)
                throw err;
            else
                throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // // Update
    // async updateChoice(id: number, choiceInput: UpdateChoiceInput): Promise<Choice> {
    //     const choice: Choice = await this.getChoice(id);
    //     try {
    //         await this.userRepository.update(id, choiceInput);
    //         const updateChoice = { ...choice, ...choiceInput };
    //         return updateChoice;
    //     } catch (err) {
    //         throw new Error(`Unexpected error: ${err.message}`);
    //     }
    // }

    // // Delete
    // async deleteChoice(id: number): Promise<number> {
    //     await this.getChoice(id);
    //     try {
    //         const result: DeleteResult = await this.userRepository.delete(id);
    //         return result.affected;
    //     } catch (err) {
    //         throw new Error(`Unexpected error: ${err.message}`);
    //     }
    // }
}
