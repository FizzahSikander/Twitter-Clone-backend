import request from 'supertest';
import app from '../server.js';

describe('POST /tweet', () => {
    let cookie;
    let userId;
    let tweetId;

    beforeEach(async () => {
        await request(app).post('/register').send({
            name: 'im a test user',
            email: 'hamoudi_lazkani@hotmail.se',
            password: 'correctpass',
            nickname: 'testUser',
        });

        const res = await request(app).post('/login').send({
            email: 'hamoudi_lazkani@hotmail.se',
            password: 'correctpass',
        });

        userId = res.body.user.id;
        cookie = res.headers['set-cookie'];
    });

    it('Should create a tweet with the hashtag "hello"', async () => {
        const res = await request(app)
            .post('/tweet')
            .set('Cookie', cookie)
            .send({
                text: 'This is a test tweet',
                tags: ['hello'],
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Tweet created successfully');
    });

    it('Should get given userIds latest tweet', async () => {
        const res = await request(app).get('/user-latest-tweet').query({ userId });
        expect(res.statusCode).toBe(200);
        expect(res.body.createdBy).toBe(userId);

        tweetId = res.body._id;
    });

    it('Should comment on a tweet', async () => {
        const res = await request(app).put('/comment').send({
            tweetId: tweetId,
            text: 'This is a test comment',
            authorId: userId,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Comment added');
        expect(res.body.tweet.comments[0].createdBy).toBe(userId);
    });
});
