const request = require('supertest');
const buildApp = require('../../app');
const UserRepo = require('../../repos/user-repo');
const pool = require('../../pool');
const Context = require('../context');

beforeAll(async () => {
    const context = await Context.build();
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