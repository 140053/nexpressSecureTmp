const request = require('supertest');
const app = require('../app'); // Import your Express app

describe('GET /', () => {
  it('should respond with a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('Welcome');
  });
});
