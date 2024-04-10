import fs from 'fs';
import { getDraftFromAI } from './calls.js';

const validationProperties = {
  todos: {
    title: '',
    completed: false,
    difficulty: "easy",
    draft: ""
  },
  pendingActions: {
  },
  context: ""
}


const defaultData = {
  todos: []
};

const getFileStorage = () => {
  try {
    const data = fs.readFileSync('db.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('db.json not found, creating new file.');
      fs.writeFileSync('db.json', JSON.stringify(defaultData), 'utf8');
      return defaultData;
    } else {
      throw error;
    }
  }
}

const db = {
  todos: null,
  init: () => {
    let _db = getFileStorage();
    db.todos = _db.todos;
  },
  get: (key) => {
    // Get from the 
    return db[key];
  },
  getInside: (key, id) => {
    return db[key].find((item) => item.id == id);
  },
  add: (key, value) => {
    const id = db[key].length + 1;
    const newValue = { id, ...value };
    db[key].push(newValue);
    db.updateJSON()
    return db[key];
  },
  delete: (key, id) => {
    db[key] = db[key].filter((item) => item.id !== id);
    db.updateJSON()
    return db[key];
  },
  update: (key, id, value) => {
    const index = db[key].findIndex((item) => item.id === id);
    db[key][index] = { ...validationProperties[key], ...db[key][index], ...value };
    db.updateJSON();
    return db[key];
  },
  generateDraft: async (key, id) => {
    const index = db[key].findIndex((item) => item.id === id);

    const { withoutAction, actionName, actionArgs } = await getDraftFromAI({
      title: db[key][index].title,
      draft: db[key][index].draft,
      inputsObject: {},
    });

    db[key][index] = { ...validationProperties[key], ...db[key][index], draft: withoutAction, pendingActions: { ...db[key][index].pendingActions, [actionName]: actionArgs } };
    db.updateJSON();

    return db[key];
  },
  continueDraft: async (key, id, inputsObject, action) => {
    const index = db[key].findIndex((item) => item.id === id);
    // remote the key action form the pendingActions
    const context = db[key][index].context
    if (context) {
      db[key][index].context = context + JSON.stringify(inputsObject);
    }
    else {
      db[key][index].context = JSON.stringify(inputsObject);
    }

    const { [action]: _, ...pendingActions } = db[key][index].pendingActions;
    const { withoutAction, actionName, actionArgs } = await getDraftFromAI({
      title: db[key][index].title,
      draft: db[key][index].draft,
      inputsObject: inputsObject,
    });
    db[key][index] = { ...validationProperties[key], ...db[key][index], draft: withoutAction, pendingActions: { ...db[key][index].pendingActions, [actionName]: actionArgs } };
    db.updateJSON();
    return db[key];
  },
  updateJSON: () => {
    fs.writeFileSync('db.json', JSON.stringify({ todos: db.todos }, null, 2), 'utf8');
  }
};

export { db };