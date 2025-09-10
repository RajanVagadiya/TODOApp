import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// db connection
export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: todos.db, location: 'default' });
};

export const createTable = async db => {
  const query =
    'CREATE TABLE IF NOT EXISTS todos( id INTEGER PRIMARY AUTOINCREMENT, title TEXT NOT NULL, desc TEXT NOT NULL, created_at INTEGER);';
  await db.executeSQL(query);
};

export const getTodos = async db => {
  try {
    const todos = [];
    const result = await db.executeSQL(
      'SELECT * FROM todos ORDER BY created_at DESC;',
    );
    result.forEach(element => {
      for (let i = 0; i < result.rows.length; i++) {
        todos.push(result.rows.item(i));
      }
    });
    return todos;
  } catch (error) {
    throw Error('Failed to get todos!!');
  }
};

export const addTodo = async(db,title,desc) =>{
    const created_at = Date.now();
    const insertQuery = 'INSERT INTO todos (title, desc,created_at) VALUES (?,?,?);';
    const result = await db.executeSQL(insertQuery, [title, desc,created_at]);
    return { id: result[0].insertId, title, desc, created_at}
};

export const updatedTodo = async (db,id,title, desc)=>{
     const updateQuery = 'UPDATE todos SET title = ?, desc = ? WHERE id = ?;';
     await db.executeSQL(updateQuery,[title,desc,id]);
};

export const deleteTodo = async (db,id)=>{
  const delteQuery = 'DELETE FROM todos WHERE id=?;';
  await db.executeSQL(delteQuery, [id]);
};