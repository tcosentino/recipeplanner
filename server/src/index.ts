import express, { Request, Response } from 'express';

export interface Ingredient { id: number; name: string; }
export interface Recipe { id: number; name: string; ingredients: number[]; }
export interface ScheduleSlot { id: number; day: string; meal: string; recipeId: number | null; }

const app = express();
app.use(express.json());

let ingredients: Ingredient[] = [];
let recipes: Recipe[] = [];
let schedule: ScheduleSlot[] = [];

function initSchedule() {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const meals = ['Breakfast','Lunch','Dinner'];
  schedule = [];
  let id = 1;
  for (const day of days) {
    for (const meal of meals) {
      schedule.push({ id: id++, day, meal, recipeId: null });
    }
  }
}
initSchedule();

export function resetData() {
  ingredients = [];
  recipes = [];
  initSchedule();
}

app.get('/ingredients', (_req: Request, res: Response) => {
  res.json(ingredients);
});
app.post('/ingredients', (req: Request, res: Response) => {
  const newIngredient: Ingredient = { id: ingredients.length + 1, name: req.body.name };
  ingredients.push(newIngredient);
  res.status(201).json(newIngredient);
});

app.get('/recipes', (_req: Request, res: Response) => {
  res.json(recipes);
});
app.post('/recipes', (req: Request, res: Response) => {
  const newRecipe: Recipe = {
    id: recipes.length + 1,
    name: req.body.name,
    ingredients: req.body.ingredients || []
  };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

app.get('/schedule', (_req: Request, res: Response) => {
  res.json(schedule);
});
app.put('/schedule/:id', (req: Request, res: Response) => {
  const slot = schedule.find(s => s.id === parseInt(req.params.id, 10));
  if (!slot) return res.status(404).end();
  slot.recipeId = req.body.recipeId;
  res.json(slot);
});

export default app;

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Server running on ${port}`));
}
