import request from 'supertest';
import app, { resetData } from '../src/index';

describe('Recipe Planner API', () => {
  beforeEach(() => {
    resetData();
  });

  test('GET /ingredients returns empty list initially', async () => {
    const res = await request(app).get('/ingredients');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /ingredients adds ingredient', async () => {
    const res = await request(app).post('/ingredients').send({ name: 'Eggs' });
    expect(res.statusCode).toBe(201);
    const getRes = await request(app).get('/ingredients');
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].name).toBe('Eggs');
  });

  test('GET /recipes returns empty list initially', async () => {
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /recipes adds recipe', async () => {
    const res = await request(app)
      .post('/recipes')
      .send({ name: 'Omelette', ingredients: [1] });
    expect(res.statusCode).toBe(201);
    const getRes = await request(app).get('/recipes');
    expect(getRes.body[0].name).toBe('Omelette');
  });

  test('GET /schedule returns week schedule', async () => {
    const res = await request(app).get('/schedule');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(7 * 3);
    expect(res.body[0]).toHaveProperty('day');
  });

  test('PUT /schedule/:id assigns recipe to slot', async () => {
    await request(app).post('/recipes').send({ name: 'Omelette', ingredients: [] });
    const res = await request(app).put('/schedule/1').send({ recipeId: 1 });
    expect(res.statusCode).toBe(200);
    const schedule = await request(app).get('/schedule');
    expect(schedule.body[0].recipeId).toBe(1);
  });
});
