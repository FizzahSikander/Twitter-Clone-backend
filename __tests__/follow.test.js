import request from 'supertest';
import app from '../server.js';

describe('POST /follow', () => {
    let cookie;
    let userId;
    let targetId;

    beforeEach(async () => {


        await request(app).post('/register').send({
            name: 'im a test user',
            email: 'target@hotmail.se',
            password: 'target',
            nickname: 'target',
        });

        await request(app).post('/register').send({
            name: 'im a test user',
            email: 'hamoudi_lazkani@hotmail.se',
            password: 'correctpass',
            nickname: 'testUser',
        });

        const target = await request(app).post('/login').send({
            email: 'target@hotmail.se',
            password: 'target',
        });

        const res = await request(app).post('/login').send({
            email: 'hamoudi_lazkani@hotmail.se',
            password: 'correctpass',
        });

        targetId = target.body.user.id
        userId = res.body.user.id;
        cookie = res.headers['set-cookie'];
    });



    it('Should follow an user', async () => {
        const res = await request(app)
            .post(`/users/${targetId}/follow`)
            .set('Cookie', cookie)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Followed user');
        expect(res.body).toHaveProperty('ok', true);

    });


    it('Should return error if already following user', async () => {
        const res = await request(app)
            .post(`/users/${targetId}/follow`)
            .set('Cookie', cookie)
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Already following this user');
    });

    it('Should unfollow a following user', async () => {
        const res = await request(app)
            .post(`/users/${targetId}/unfollow`)
            .set('Cookie', cookie)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Unfollowed user');
        expect(res.body).toHaveProperty('ok', true);

    });

    it('Should should return error if unfollowing a non exisitng user', async () => {
        const res = await request(app)
            .post(`/users/507f1f77bcf86cd799439011/unfollow`)
            .set('Cookie', cookie)
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });



});
