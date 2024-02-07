import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAnswerInput, UpdateAnswerInput } from './answer.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,
    ) {}
    private readonly logger: Logger = new Logger(AnswerService.name);

    // Create
    async createAnswer(answerInput: CreateAnswerInput): Promise<Answer> {
        try {
            const newAnswer: Answer = this.answerRepository.create(answerInput);
            return await this.answerRepository.save(newAnswer);
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
    
    // Read
    async getAnswer(id: number): Promise<Answer> {
        try {
            const result: Answer = await this.answerRepository.findOne({ where: { id: id }});
            
            if (result === null)
                throw new NotFoundException(`ID: ${id}에 해당하는 항목을 찾을 수 없습니다.`);
            else
                return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getAnswers(): Promise<Answer[]> {
        try {
            const result: Answer[] = await this.answerRepository.find();
            return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Update
    async updateAnswer(id: number, answerInput: UpdateAnswerInput): Promise<Answer> {
        const answer: Answer = await this.getAnswer(id);
        try {
            await this.answerRepository.update(id, answerInput);
            const updateAnswer = { ...answer, ...answerInput };
            return updateAnswer;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Delete
    async deleteAnswer(id: number): Promise<number> {
        await this.getAnswer(id);
        try {
            const result: DeleteResult = await this.answerRepository.delete(id);
            return result.affected;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
}
