const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const seedingData = require('../db/data/test-data/index.js');

beforeEach(() => seed(seedingData));
afterAll(() => db.end());


describe.only('api/categories', () => {
    test('GET:200 responds with an array of category objects, each of which should have the properties slug and description', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then((response) => {
                expect(response.body.categorie).toEqual(expect.any(Array));
                expect(Object.keys(response.body.categorie[0])).toEqual(
                    expect.arrayContaining(['slug', 'description'])
                );
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