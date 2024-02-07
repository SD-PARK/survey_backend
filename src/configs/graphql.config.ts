import { ApolloDriver, ApolloDriverConfig, ValidationError } from "@nestjs/apollo";
import { Logger } from "@nestjs/common";
import { join } from "path";

const logger: Logger = new Logger('GraphQLConfig');

export const graphQLConfig: ApolloDriverConfig = {
    driver: ApolloDriver,
    playground: true,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    formatError: (err, data) => {
        let { message, extensions } = err;
        logger.error(err.message);
      
        // class-validator 및 graphQL의 유효성 검사 핸들링
        if (err instanceof ValidationError || (extensions && extensions.code === "GRAPHQL_VALIDATION_FAILED")) {
          extensions = { status: 400 };
        } else if (err.message.includes('참조키(foreign key) 제약 조건을 위배했습니다')) {
          message = '참조키(foreign key)를 가진 속성에 유효하지 않은 값이 입력되었습니다.';
          extensions = { status: 400 };
        } else if (err.message.includes('해당하는 항목을 찾을 수 없습니다.')) {
          message = err.message.substring(18);
          extensions = { status: 404 };
        }

        const errorResponse = {
          message: extensions && extensions.status ? message : "Internal Server Error",
          status: extensions && extensions.status ? extensions.status : 500,
        }
      
        return errorResponse;
    },
}