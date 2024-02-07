import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll((done) => {
    app.close();
    done();
  });

  describe('survey', () => {
    it('Fail: getSurveys', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{
            getSurveys {
              ids
              title
              description
            }
          }`
        })
        .expect(400);
    });
    it('Pass: getSurveys', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{
            getSurveys {
              id
              title
              description
            }
          }`
        })
        .expect(200);
    });
  });
});
