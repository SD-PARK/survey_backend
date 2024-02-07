import { Module } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { ChoiceResolver } from './choice.resolver';
import { Choice } from './choice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Choice])],
  providers: [ChoiceService, ChoiceResolver]
})
export class ChoiceModule {}
