const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const seedingData = require('../db/data/test-data/index.js');
const { } = require('../db/seeds/utils.js');

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

describe('/api/reviews', () => {
    test('GET:200 responds with array of reviews with properties: owner(which is the `username` from the users table), title, review_id, category, review_img_url, created_at, votes, designer, comment_count which is the total count of all the comments with this review_id. the reviews should be sorted by date in descending order', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(response => {
                const reviews = response.body.reviews;
                expect(reviews.length === 13).toBe(true);
                expect(reviews[0]).toEqual(expect.objectContaining({
                    owner: 'mallionaire',
                    title: 'Mollit elit qui incididunt veniam occaecat cupidatat',
                    review_id: 7,
                    category: 'social deduction',
                    review_img_url: 'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    created_at: '2021-01-25T11:16:54.963Z',
                    votes: 9,
                    designer: 'Avery Wunzboogerz',
                    comment_count: '0'
                }));
                expect(reviews).toBeSortedBy('created_at', {
                    descending: true,
                });
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

describe('/api/reviews/:review_id', () => {
    test('GET:200 Responds with:a review object, with properties:`review_id` which is the primary key- `title`- `review_body`- `designer`- `review_img_url` - `votes` - `category` field which references the `slug` in the categories table-  `owner` field that references a user"s primary key (`username`)- `created_at`', () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then((response) => {
                expect(response.body.review[0]).toEqual(
                    expect.objectContaining({
                        title: 'Jenga',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_img_url:
                            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Fiddly fun for all the family',
                        category: 'dexterity',
                        created_at: '2021-01-18T10:01:41.251Z',
                        votes: 5
                    })
                );
            });
    });
    test("400: sends an appropriate error message when passed an invalid id", () => {
        return request(app)
            .get("/api/reviews/sluguish")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Invalid review identifier");
            });
    });
    test("404: sends an appropriate error message when passed a valid but non-existent id", () => {
        return request(app)
            .get("/api/reviews/777")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review 777 could not be found");
            });
    });
});
