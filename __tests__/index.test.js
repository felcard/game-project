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
});

describe('/api/reviews', () => {
    test('GET: 200 responds with reviews with optional category, sort_by, and order queries', () => {
        return request(app)
            .get('/api/reviews?category=dexterity&order=DESC')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews[0]).toEqual({
                    review_id: 2,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url:
                        'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 5
                });
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
                        votes: 5,
                        comment_count: '3'
                    })
                );
            });
    });
    test("400: sends an appropriate error message when passed an invalid id", () => {
        return request(app)
            .get("/api/reviews/sluguish")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request");
            });
    });
    test("404: sends an appropriate error message when passed a valid but non-existent id", () => {
        return request(app)
            .get("/api/reviews/777")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
});


describe('GET /api/reviews/:review_id/comments', () => {
    test('GET:200 responds with an array of comments for the given review_id of which each comment should have the following properties:- `comment_id`- `votes`- `created_at`- `author` which is the `username` from the users table- `body`- `review_id`comments should be served with the most recent comments first',
        () => {
            return request(app)
                .get('/api/reviews/2/comments')
                .expect(200)
                .then((response) => {
                    const { comments } = response.body;
                    expect(comments.length > 0).toBe(true);
                    comments.forEach(comment => {
                        expect(comment).toMatchObject({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            review_id: 2,
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String)
                        });
                    });
                    expect(comments).toBeSortedBy('created_at', {
                        descending: true,
                    });
                });
        });
    test('GET:200 responds with an empty array when passed a valid id with no associated comment', () => {
        return request(app)
            .get('/api/reviews/7/comments')
            .expect(200)
            .then((response) => {
                expect(response.body.comments).toEqual([]);
            });
    });
    test('GET:404 sends an appropriate and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/reviews/777/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Review not Found');
            });
    });
    test("GET:400 sends an appropriate error message when passed an invalid id", () => {
        return request(app)
            .get("/api/reviews/rubish_id/comments")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request");
            });
    });
});

describe('Bad routes', () => {
    test('GET:404 responds with a message of "Wrong URL" when provided with wrong end point', () => {
        return request(app)
            .get('/api/badURL')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Wrong URL!');
            });
    });
});

describe('GET: /api/users', () => {
    test('GET: 200 retrieves an array of user objects with username, name and avatar_url props', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users.length > 0).toBe(true);
                expect(users[0]).toEqual({
                    username: 'mallionaire',
                    name: 'haz',
                    avatar_url:
                        'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                });
            });
    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    test('POST 201: accepts request body object with username and body and responds with the posted comment', () => {
        const newComment = {
            username: 'mallionaire',
            body: 'I enjoy playing this game every time and wit the usual suspects'
        };
        return request(app)
            .post('/api/reviews/2/comments')
            .send(newComment)
            .expect(201)
            .then(response => {
                expect(response.body.insertedComment).toMatchObject({
                    comment_id: 7,
                    body: 'I enjoy playing this game every time and wit the usual suspects',
                    review_id: 2,
                    author: 'mallionaire',
                    votes: 0,
                    created_at: expect.any(String)
                });
            });
    });
    test('POST 201: accepts request body object with username and body and responds with the posted comment IGNORING additional properties', () => {
        const newComment = {
            username: 'mallionaire',
            body: 'I enjoy playing this game every time and wit the usual suspects',
            head: "I'm useless",
            shoulders: 'We carry a useless thing'
        };
        return request(app)
            .post('/api/reviews/2/comments')
            .send(newComment)
            .expect(201)
            .then(response => {
                expect(response.body.insertedComment).toMatchObject({
                    comment_id: 7,
                    body: 'I enjoy playing this game every time and wit the usual suspects',
                    review_id: 2,
                    author: 'mallionaire',
                    votes: 0,
                    created_at: expect.any(String)
                });
            });
    });
    test('POST: 400 responds with appropriate and error message when passed an invalid id', () => {
        return request(app)
            .post("/api/reviews/shadyPoint/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
    test('POST: 400 responds with appropriate and error message when incomplete body object', () => {
        const newComment = {
            body: 'I enjoy playing this game every time and wit the usual suspects'
        };
        return request(app)
            .post("/api/reviews/5/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
            });
    });
    test('POST: 404 responds with appropriate and error message when passed a valid but non-existent id', () => {
        const newComment = {
            username: 'mallionaire',
            body: 'I enjoy playing this game every time and wit the usual suspects'
        };
        return request(app)
            .post('/api/reviews/777/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Review not Found");
            });
    });
    test('POST: 404 responds with appropriate and error message when username is not found', () => {
        const newComment = {
            username: 'Keyser Soze',
            body: 'I enjoy playing this game every time and wit the usual suspects'
        };
        return request(app)
            .post('/api/reviews/2/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Username not Found");
            });
    });
});

describe('PATCH : /api/reviews/:review_id', () => {
    test('PATCH 200: updates review votes acording to passed object', () => {
        return request(app)
            .patch('/api/reviews/7')
            .send({ inc_votes: 5 })
            .expect(200)
            .then(({ body }) => {
                expect(body.review[0]).toMatchObject({
                    review_id: 7,
                    title: 'Mollit elit qui incididunt veniam occaecat cupidatat',
                    designer: 'Avery Wunzboogerz',
                    owner: 'mallionaire',
                    review_img_url:
                        'https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                    review_body:
                        'Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.',
                    category: 'social deduction',
                    created_at: '2021-01-25T11:16:54.963Z',
                    votes: 14
                });
            });

    });
    test('PATCH: 200 responds with review and votes equal to 0 when votes number below 0', () => {
        return request(app)
            .patch('/api/reviews/7')
            .send({ inc_votes: -500 })
            .expect(200)
            .then(({ body }) => {
                expect(body.review.votes).toBe(0);
            });
    });
    test('PATCH: 400 responds with error when object has wrong data', () => {
        return request(app)
            .patch('/api/reviews/7')
            .send({ inc_votes: 'referendum' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
    test('PATCH: 400 responds with error when passed invalid review id', () => {
        return request(app)
            .patch('/api/reviews/garbage')
            .send({ inc_votes: 5 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
    test('PATCH: 404 responds with error when passed valid but non existant review id', () => {
        return request(app)
            .patch('/api/reviews/777')
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Review not Found');
            });
    });
    test('PATCH: 400 responds with error when object is missing the expected property', () => {
        return request(app)
            .patch('/api/reviews/7')
            .send({ rating: 5 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
    test('PATCH: 400 responds with error when the object property key is wrong', () => {
        return request(app)
            .patch('/api/reviews/7')
            .send({ inc_vooootes: 8 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
});

