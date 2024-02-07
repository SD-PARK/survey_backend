import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateQuestionInput, UpdateQuestionInput } from './question.input';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question) private readonly questionRepository: Repository<Question>,
    ) {}
    private readonly logger: Logger = new Logger(QuestionService.name);

    // Create
    async createQuestion(questionInput: CreateQuestionInput): Promise<Question> {
        try {
            const newQuestion: Question = this.questionRepository.create(questionInput);
            return await this.questionRepository.save(newQuestion);
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
    
    // Read
    async getQuestion(id: number): Promise<Question> {
        try {
            const result: Question = await this.questionRepository.findOne({ where: { id: id }});

            if (result === null)
                throw new NotFoundException(`ID: ${id}에 해당하는 항목을 찾을 수 없습니다.`);
            else
                return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getQuestions(): Promise<Question[]> {
        try {
            const result: Question[] = await this.questionRepository.find();
            return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Update
    async updateQuestion(id: number, questionInput: UpdateQuestionInput): Promise<Question> {
        const question: Question = await this.getQuestion(id);
        try {
            await this.questionRepository.update(id, questionInput);
            const updateQuestion = { ...question, ...questionInput };
            return updateQuestion;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Delete
    async deleteQuestion(id: number): Promise<number> {
        await this.getQuestion(id);
        try {
            const result: DeleteResult = await this.questionRepository.delete(id);
            return result.affected;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
}
