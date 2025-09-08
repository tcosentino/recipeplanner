import React, { useState } from 'react';

type Recipe = { id: number; name: string };
interface ScheduleSlot { id: number; day: string; meal: string; recipeId: number | null; }

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const meals = ['Breakfast','Lunch','Dinner'];

const recipes: Recipe[] = [
  { id: 1, name: 'Omelette' },
  { id: 2, name: 'Toast' }
];

const ingredients = ['Eggs', 'Bread'];

function buildInitialSchedule(): ScheduleSlot[] {
  const result: ScheduleSlot[] = [];
  let id = 1;
  for (const day of days) {
    for (const meal of meals) {
      result.push({ id: id++, day, meal, recipeId: null });
    }
  }
  return result;
}

export default function App() {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(buildInitialSchedule());

  function handleDrop(slotId: number, recipeId: number) {
    setSchedule(prev => prev.map(s => s.id === slotId ? { ...s, recipeId } : s));
  }

  return (
    <div>
      <h1>Inventory</h1>
      <ul>
        {ingredients.map(ing => <li key={ing}>{ing}</li>)}
      </ul>
      <h1>Recipes</h1>
      <ul id="recipes">
        {recipes.map(r => (
          <li key={r.id} draggable data-testid="recipe" onDragStart={e => e.dataTransfer.setData('text/plain', String(r.id))} data-id={r.id}>
            {r.name}
          </li>
        ))}
      </ul>
      <h1>Schedule</h1>
      <table>
        <tbody>
          {schedule.map(slot => (
            <tr key={slot.id}>
              <td
                data-testid="slot"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const id = parseInt(e.dataTransfer.getData('text/plain'), 10);
                  handleDrop(slot.id, id);
                }}
              >
                {slot.recipeId ? recipes.find(r => r.id === slot.recipeId)?.name : `${slot.day} ${slot.meal}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
