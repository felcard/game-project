const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const seedingData = require('../db/data/test-data/index.js');

beforeEach(() => seed(seedingData));
afterAll(() => db.end());


describe('api/categories', () => {
    test('GET:200 responds with an array of category objects, each of which should have the properties slug and description', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then((response) => {
                const categories = response.body.categories;
                expect(categories.length > 0).toBe(true);
                categories.forEach(category => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    });
                });
                expect();
            });
    });
    test('GET:404 responds with a message of "Wrong URL" when provided with wrong end point', () => {
        return request(app)
            .get('/api/badURL')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Wrong URL!');
            });
    });
});