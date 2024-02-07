import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Choice } from './choice.entity';
import { CreateChoiceInput, UpdateChoiceInput } from './choice.input';

@Injectable()
export class ChoiceService {
    constructor(
        @InjectRepository(Choice) private readonly choiceRepository: Repository<Choice>,
    ) {}
    private readonly logger: Logger = new Logger(ChoiceService.name);

    // Create
    async createChoice(choiceInput: CreateChoiceInput): Promise<Choice> {
        try {
            const newChoice: Choice = this.choiceRepository.create(choiceInput);
            return await this.choiceRepository.save(newChoice);
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
    
    // Read
    async getChoice(id: number): Promise<Choice> {
        try {
            const result: Choice = await this.choiceRepository.findOne({ where: { id: id }});

            if (result === null)
                throw new NotFoundException(`ID: ${id}에 해당하는 항목을 찾을 수 없습니다.`);
            else
                return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    async getChoices(): Promise<Choice[]> {
        try {
            const result: Choice[] = await this.choiceRepository.find();
            return result;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Update
    async updateChoice(id: number, choiceInput: UpdateChoiceInput): Promise<Choice> {
        const choice: Choice = await this.getChoice(id);
        try {
            await this.choiceRepository.update(id, choiceInput);
            const updateChoice = { ...choice, ...choiceInput };
            return updateChoice;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }

    // Delete
    async deleteChoice(id: number): Promise<number> {
        await this.getChoice(id);
        try {
            const result: DeleteResult = await this.choiceRepository.delete(id);
            return result.affected;
        } catch (err) {
            throw new Error(`Unexpected error: ${err.message}`);
        }
    }
}
