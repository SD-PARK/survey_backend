## Description

객관식 설문지를 생성 및 관리하는 서버입니다.

<p align="center">
  <img src ="https://img.shields.io/badge/TYPESCRIPT-3178C6.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/>
  <img src ="https://img.shields.io/badge/NESTJS-E0234E.svg?&style=for-the-badge&logo=NestJS&logoColor=white"/>
  <img src ="https://img.shields.io/badge/GRAPHQL-E10098.svg?&style=for-the-badge&logo=GraphQL&logoColor=white"/>
  <img src ="https://img.shields.io/badge/POSTGRESQL-4169E1.svg?&style=for-the-badge&logo=PostgreSQL&logoColor=white"/>
</p>

## Installation

```bash
$ npm install
```

## Settings

해당 프로젝트는 PostgreSQL을 사용합니다.

서버 실행을 위해서는 .env 파일을 생성해 DB 정보를 작성해야 합니다.

1. 프로젝트 루트 디렉토리에 `.env` 파일을 생성합니다.

2. `.env` 파일을 편집기로 열어 다음과 같이 작성합니다.
```
DB_HOST=[DB-HOST]
DB_PORT=[DB-PORT]
DB_USERNAME=[DB-USERNAME]
DB_PASSWORD=[DB-PASSWORD]
DB_NAME=[DB-NAME]
```

3. `.env` 파일을 저장합니다.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

`localhost:4000/graphql`에 접속해 API를 테스트할 수 있습니다.

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## ERD

![DB](https://github.com/SD-PARK/survey/assets/97375357/a2eb119c-5999-495c-9ad8-e6c15372f351)

## API

***"작성지 CRUD를 통해 설문지 완료, 완료된 설문지 확인, 설문지 총점 확인 등의 기능을 확인할 수 있습니다."***

1. [설문지 CRUD](#설문지-CRUD)
2. [문항 CRUD](#문항-CRUD)
3. [선택지 CRUD](#선택지-CRUD)
4. [답변 CRUD](#답변-CRUD)
5. [작성지 CRUD](#작성지-CRUD)

---
### 설문지 CRUD
**CREATE**

`새 설문지를 생성합니다.`
```graphql
mutation {
  createSurvey(surveyInput: {
    title: "호그와트 기숙사 테스트"
    description: "본 온라인 호그와트 기숙사 배정 모자 테스트는 그리핀도르, 래번클로, 후플푸프, 슬리데린의 네 가지 호그와트 기숙사에 해당되는 점수를 매깁니다."
  }) {
    id
    title
    description
  }
}
```

**READ**

`ID에 해당하는 설문지를 조회합니다.`
```graphql
query {
  getSurvey(id: 1) {
    id
    title
    description
  }
}
```

`모든 설문지를 조회합니다.`
```graphql
query {
  getSurveys {
    id
    title
    description
  }
}
```

**UPDATE**

`설문지 데이터를 변경합니다.`
```graphql
mutation {
  updateSurvey(id: 1, surveyInput: {
    title: "호그와트 기숙사 배정 테스트"
    description: "테스트를 통해 그리핀도르, 래번클로, 후플푸프, 슬리데린의 네 가지 호그와트 기숙사 중 어울리는 기숙사를 찾습니다."
}) {
    id
    title
    description
  }
}
```

**DELETE**

`설문지를 삭제합니다.`
```graphql
mutation {
  deleteSurvey(id: 1)
}
```
---
### 문항 CRUD
**CREATE**

`새 문항을 생성합니다.`
```graphql
mutation {
  createQuestion(questionInput: {
    surveyId: 1
    content: "왼쪽인가? 오른쪽인가?"
  }) {
    id
    surveyId
    content
  }
}
```

**READ**

`ID에 해당하는 문항을 조회합니다.`
```graphql
query {
  getQuestion(id: 1) {
    id
    surveyId
    content
  }
}
```

`모든 문항을 조회합니다.`
```graphql
query {
  getQuestions {
    id
    surveyId
    content
  }
}
```

**UPDATE**

`문항 데이터를 변경합니다.`
```graphql
mutation {
  updateQuestion(id: 1, questionInput: {
    surveyId: 2
    content: "머리인가? 꼬리인가?"
}) {
    id
    surveyId
    content
  }
}
```

**DELETE**

`문항을 삭제합니다.`
```graphql
mutation {
  deleteQuestion(id: 1)
}
```
---
### 선택지 CRUD
**CREATE**

`새 선택지를 생성합니다.`
```graphql
mutation {
  createChoice(choiceInput: {
    questionId: 1
    content: "왼쪽"
    score: 1
  }) {
    id
    questionId
    content
    score
  }
}
```

**READ**

`ID에 해당하는 선택지를 조회합니다.`
```graphql
query {
  getChoice(id: 1) {
    id
    questionId
    content
    score
  }
}
```

`모든 선택지를 조회합니다.`
```graphql
query {
  getChoices {
    id
    questionId
    content
    score
  }
}
```

**UPDATE**

`선택지 데이터를 변경합니다.`
```graphql
mutation {
  updateChoice(id: 1, choiceInput: {
    questionId: 2
    content: "머리"
    score: 2
}) {
    id
    questionId
    content
    score
  }
}
```

**DELETE**

`선택지를 삭제합니다.`
```graphql
mutation {
  deleteChoice(id: 1)
}
```
---
### 답변 CRUD
**CREATE**

`새 답변을 생성합니다.`
```graphql
mutation {
  createAnswer(answerInput: {
    surveyResponseId: 1
    choiceId: 1
  }) {
    id
    surveyResponseId
    choiceId
  }
}
```

**READ**

`ID에 해당하는 답변을 조회합니다.`
```graphql
query {
  getAnswer(id: 1) {
    id
    surveyResponseId
    choiceId
  }
}
```

`모든 답변을 조회합니다.`
```graphql
query {
  getAnswers {
    id
    surveyResponseId
    choiceId
  }
}
```

**UPDATE**

`답변 데이터를 변경합니다.`
```graphql
mutation {
  updateAnswer(id: 1, answerInput: {
    surveyResponseId: 2
    choiceId: 2
}) {
    id
    surveyResponseId
    choiceId
  }
}
```

**DELETE**

`답변을 삭제합니다.`
```graphql
mutation {
  deleteAnswer(id: 1)
}
```
---
### 작성지 CRUD
**CREATE**

`새 작성지를 생성합니다.`
```graphql
mutation {
  createSurveyResponse(surveyResponseInput: {
    surveyId: 1
    userId: 1
  }) {
    id
    surveyId
    userId
    completionDate
    score
  }
}
```

**READ**

`ID에 해당하는 작성지를 조회합니다.`
```graphql
query {
  getSurveyResponse(id: 1) {
    id
    surveyId
    userId
    completionDate
    score
  }
}
```

`모든 작성지를 조회합니다.`
```graphql
query {
  getSurveyResponses {
    id
    surveyId
    userId
    completionDate
    score
  }
}
```

`완료된 작성지를 조회합니다.`
```graphql
query {
  getCompletedSurveys {
    id
    surveyId
    userId
    completionDate
    score
  }
}
```

**UPDATE**

`작성지 데이터를 변경합니다.`
```graphql
mutation {
  updateSurveyResponse(id: 1, surveyResponseInput: {
    surveyId: 2
    userId: 2
}) {
    id
    surveyId
    userId
    completionDate
    score
  }
}
```

`작성지를 완료합니다. 테이블의 completionDate 값에 현재 시각이 입력됩니다.`
```graphql
mutation {
  completeSurvey(id: 1) {
    id
    surveyId
    userId
    completionDate
    score
  }
}
```

**DELETE**

`작성지를 삭제합니다.`
```graphql
mutation {
  deleteSurveyResponse(id: 1)
}
```
