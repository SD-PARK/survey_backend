import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { Answer } from "src/modules/answer/answer.entity";
import { Choice } from "src/modules/choice/choice.entity";
import { Question } from "src/modules/question/question.entity";
import { Survey } from "src/modules/survey/survey.entity";
import { SurveyResponse } from "src/modules/survey_response/survey_response.entity";

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
    useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // extra: {
        //   'ssl': {
        //     'rejectUnauthorized': false
        //   }
        // },
        entities: [Survey, Question, Choice, SurveyResponse, Answer],
    }),
    inject: [ConfigService],
}