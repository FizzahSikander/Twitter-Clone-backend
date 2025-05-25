import request from 'supertest';
import app from '../server.js';

describe('GET /profile/:username', () => {
    let cookie;

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

        cookie = res.headers['set-cookie'];
    });

    it('Should return not found when visting a non existing user profile', async () => {
        const res = await request(app).get('/profile/fakeUser')
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "User not found");
    });

    it('Should return user data when visting an existing user profile', async () => {
        const res = await request(app).get('/profile/testUser')
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body).toHaveProperty("tweetsByUser");
        expect(res.body.user).toHaveProperty("nickname", "testUser");
    });
});
