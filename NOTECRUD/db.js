import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: 'todos.db', location: 'default' });
};

export const createTable = async db => {
  const query = `
    CREATE TABLE IF NOT EXISTS todos(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      desc TEXT,
      created_at INTEGER
    );
  `;
  await db.executeSql(query);
};

export const getTodos = async db => {
  try {
    const todos = [];
    const results = await db.executeSql(
      'SELECT * FROM todos ORDER BY created_at DESC;',
    );
    const rows = results[0].rows;

    for (let i = 0; i < rows.length; i++) {
      //  todos = [...todos, { ...rows.item(i) }];
      todos.push(rows.item(i));
    }
    return todos;
  } catch (error) {
    throw new Error('Failed to get todos');
  }
};

export const addTodo = async (db, title, desc) => {
  const created_at = Date.now();
  const insertQuery =
    'INSERT INTO todos (title, desc, created_at) VALUES (?, ?, ?);';
  const result = await db.executeSql(insertQuery, [title, desc, created_at]);
  return { id: result[0].insertId, title, desc, created_at };
};

export const updatedTodo = async (db, id, title, desc) => {
  const updateQuery = 'UPDATE todos SET title = ?, desc = ? WHERE id = ?;';
  await db.executeSql(updateQuery, [title, desc, id]);
};

export const deleteTodo = async (db, id) => {
  const deleteQuery = 'DELETE FROM todos WHERE id = ?;';
  await db.executeSql(deleteQuery, [id]);
};
