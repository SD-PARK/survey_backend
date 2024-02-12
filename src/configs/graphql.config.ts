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
        logger.error(message);
      
        // class-validator 및 graphQL의 유효성 검사 핸들링
        if (err instanceof ValidationError || (extensions && extensions.code === "GRAPHQL_VALIDATION_FAILED")) {
          extensions = { status: 400 };
        } else if (err.extensions.status || err.extensions.originalError) {
          const originalError = err.extensions.originalError as { statusCode: number };
          extensions = { status: originalError.statusCode || err.extensions.status };
        } else if (err.message.includes('참조키(foreign key) 제약 조건을 위배했습니다')) {
          message = 'ID 값이 유효하지 않습니다.';
          extensions = { status: 400 };
        }

        const errorResponse = {
          message: extensions && extensions.status ? message : "Internal Server Error",
          status: extensions && extensions.status ? extensions.status : 500,
        }
      
        return errorResponse;
    },
}