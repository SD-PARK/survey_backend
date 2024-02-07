import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './configs/typeorm.config';
import { graphQLConfig } from './configs/graphql.config';
import { SurveyModule } from './modules/survey/survey.module';
import { QuestionModule } from './modules/question/question.module';
import { ChoiceModule } from './modules/choice/choice.module';
import { SurveyResponseModule } from './modules/survey_response/survey_response.module';
import { AnswerModule } from './modules/answer/answer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>(graphQLConfig),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    SurveyModule, QuestionModule, ChoiceModule, SurveyResponseModule, AnswerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
