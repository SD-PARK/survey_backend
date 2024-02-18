## Description

객관식 설문지를 생성 및 관리하는 서버입니다.

<p align="center">
  <img src ="https://img.shields.io/badge/TYPESCRIPT-3178C6.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/>
  <img src ="https://img.shields.io/badge/NESTJS-E0234E.svg?&style=for-the-badge&logo=NestJS&logoColor=white"/>
  <img src ="https://img.shields.io/badge/MYSQL-4479A1.svg?&style=for-the-badge&logo=MySQL&logoColor=white"/>
  <img src ="https://img.shields.io/badge/MYSQL-4479A1.svg?&style=for-the-badge&logo=MySQL&logoColor=white"/>
  <img src ="https://img.shields.io/badge/MYSQL-4479A1.svg?&style=for-the-badge&logo=MySQL&logoColor=white"/>
  <img src ="https://img.shields.io/badge/MYSQL-4479A1.svg?&style=for-the-badge&logo=MySQL&logoColor=white"/>
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

1. [유저 API](#유저-API)
2. [로그인 API](#로그인-API)
3. [게시글 API](#게시글-API)
4. [댓글 API](#댓글-API)

---

### 유저 API

**`GET /v1/users`**

유저를 조회합니다.

**Response**

Code **200**: 조회된 유저 정보

Code **401**: 권한 없음

<br>

**`POST /v1/users`**

유저를 생성합니다.

**Body Example**
```
{
  "email": "test@test.com",
  "password": "test123!",
  "name": "닉네임"
}
```

**Response**

Code **201**: 생성된 유저 정보
```
{
  "userId": 1,
  "email": "test@test.com",
  "password": "test123!",
  "name": "닉네임",
  "regdate": "2024-01-01 00:00:00"
}
```

Code **401**: 권한 없음

Code **409**: 이미 존재하는 계정

<br>

**`PATCH /v1/users`**

유저 정보를 변경합니다.

**Body Example**
```
{
  "password": "test123!",
  "name": "닉네임"
}
```

**Response**

Code **200**: 수정된 유저 정보
```
{
  "userId": 1,
  "email": "test@test.com",
  "password": "test123!",
  "name": "닉네임",
  "regdate": "2024-01-01 00:00:00"
}
```

Code **401**: 권한 없음

Code **404**: 유저 ID가 유효하지 않음

<br>

**`DELETE /v1/users/`**

유저를 삭제합니다.

**Response**

Code **200**: 삭제 완료

Code **401**: 권한 없음

Code **404**: 유저 ID가 유효하지 않음

---

### 로그인 API

**`POST /v1/auths/login`**

로그인 후 Access Token과 Refesh Token을 발급합니다.

**Body Example**
```
{
  "email": "test@test.com",
  "password": "test123!"
}
```

**Response**

Code **201**: 토큰 반환
```
{
  "access_token": "string",
  "refresh_token": "string"
}
```

Code **401**: 권한 없음

Code **403**: 이메일 또는 비밀번호가 유효하지 않음

<br>

**`POST /v1/auths/refresh`**

Access Token을 재발급합니다.

**Response**

Code **201**: Access Token 반환
```
{
  "access_token": "string"
}
```

Code **401**: Refresh Token이 유효하지 않음

---

### 게시글 API

**`GET /v1/boards`**

게시글 목록을 조회합니다.

**Query Example**
```
target?: "all" || "title" || "writer",
keyword?: "키워드",
category?: "공지사항",
sort?: "view" || "view7d" || "view30d" || "view365d",
page?: 1
```

**Response**

Code **200**: 조회된 게시글 목록
```
[
  {
    "id": 1,
    "category": "공지사항",
    "writer": "작성자",
    "title": "제목",
    "regdate": "2024-01-01 00:00:00",
    "views": 0
  }
]
```

Code **401**: 권한 없음

<br>

**`GET /v1/boards/${id}`**

특정 게시글을 조회합니다.

**Response**

Code **200**: 조회된 게시글
```
{
  "boardId": 1,
  "categoryId": 1,
  "userId": 1,
  "title": "제목",
  "content": "내용",
  "regdate": "2024-01-01 00:00:00",
  "updatedate": "2024-01-01 00:00:00",
  "deletedate": "2024-01-01 00:00:00",
  "views": 0
}
```

Code **401**: 권한 없음

Code **404**: 게시글이 존재하지 않음

<br>

**`POST /v1/boards`**

새 게시글을 작성합니다.

**Body Example**
```
{
  "categoryId": 1,
  "title": "title",
  "content": "content"
}
```

**Response**

Code **201**: 작성된 게시글
```
{
  "boardId": 1,
  "categoryId": 1,
  "userId": 1,
  "title": "제목",
  "content": "내용",
  "regdate": "2024-01-01 00:00:00",
  "updatedate": "2024-01-01 00:00:00",
  "deletedate": "2024-01-01 00:00:00",
  "views": 0
}
```

Code **400**: 카테고리 ID가 유효하지 않음

Code **401**: 권한 없음

<br>

**`PATCH /v1/boards/${id}`**

게시글을 수정합니다.

**Body Example**
```
{
  "categoryId": 1,
  "title": "title",
  "content": "content"
}
```

**Response**

Code **200**: 수정된 게시글
```
{
  "boardId": 1,
  "categoryId": 1,
  "userId": 1,
  "title": "제목",
  "content": "내용",
  "regdate": "2024-01-01 00:00:00",
  "updatedate": "2024-01-01 00:00:00",
  "deletedate": "2024-01-01 00:00:00",
  "views": 0
}
```

Code **400**: 카테고리 ID가 유효하지 않음

Code **401**: 권한 없음

Code **404**: 게시글 ID가 유효하지 않음

<br>

**`DELETE /v1/boards/${id}`**

게시글을 삭제합니다.

**Response**

Code **200**: 삭제 완료

Code **401**: 권한 없음

Code **404**: 게시글 ID가 유효하지 않음

---
