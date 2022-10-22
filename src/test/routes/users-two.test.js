const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');

beforeAll(() => {
    return pool.connect({
        host: 'localhost',
        port: 5432,
        database: 'socialnetwork-test',
        user: 'pauloedums',
        password: 'admin'
    });
});

afterAll(() => {
    return pool.close();
});

test('create a user', async() => {
    
    const startingCount = await UserRepo.count();

    await request(buildApp())
        .post('/users')
        .send({
            username: 'testeUser',
            bio: 'teste bio'
        })
        .expect(200);
    
        const finishCount = await UserRepo.count();
        expect(finishCount - startingCount).toEqual(1);
});