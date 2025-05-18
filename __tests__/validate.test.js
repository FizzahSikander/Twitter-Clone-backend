import request from 'supertest';
import app from '../server.js';

describe('GET /validate', () => {
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

    it('should validate request with a valid token', async () => {
        const res = await request(app).get('/validate').set('Cookie', cookie);

        expect(res.statusCode).toBe(200);
        expect(res.body).toMatchObject({
            message: 'Token is valid',
            ok: true,
        });
        expect(res.body).toHaveProperty('user');
    });

    it('should reject request with no token', async () => {
        const res = await request(app).get('/validate');
        expect(res.statusCode).toBe(403);
        expect(res.body).toMatchObject({
            error: 'No token provided',
        });
    });

    it('should reject request with a fake token', async () => {
        const res = await request(app).get('/validate').set('Cookie', 'token=FakeToken');

        console.log('Fake token:', res.body);
        expect(res.statusCode).toBe(401);
        expect(res.body).toMatchObject({
            error: 'Unauthorized token',
        });
    });

    it('should login user with correct credentials', async () => {
        const res = await request(app).post('/login').send({
            email: 'hamoudi_lazkani@hotmail.se',
            password: 'correctpass',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Authenticated');
        expect(res.headers['set-cookie']).toBeDefined();
        expect(res.headers['set-cookie'][0]).toContain('token=');
    });


    it('should visiting user profile data', async () => {
        const res = await request(app).get('/profile/testUser')

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("nickname", "testUser");

    });
});
