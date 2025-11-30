import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('HikesDB.db');

// Hàm khởi tạo bảng
export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS hikes (' +
          'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
          'name TEXT NOT NULL, ' +
          'location TEXT NOT NULL, ' +
          'date TEXT NOT NULL, ' +
          'parking TEXT NOT NULL, ' +
          'length REAL NOT NULL, ' +
          'difficulty TEXT NOT NULL, ' +
          'description TEXT, ' +
          'custom_field1 TEXT, ' +
          'custom_field2 TEXT' +
          ');',
        [],
        () => resolve(), 
        (_, err) => reject(err) 
      );
    });
  });
};

export const addHike = (hike) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO hikes (name, location, date, parking, length, difficulty, description, custom_field1, custom_field2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          hike.name,
          hike.location,
          hike.date,
          hike.parking,
          hike.length,
          hike.difficulty,
          hike.description,
          hike.custom_field1,
          hike.custom_field2,
        ],
        (_, result) => resolve(result.insertId),
        (_, err) => reject(err)
      );
    });
  });
};

export const updateHike = (hike) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE hikes SET name = ?, location = ?, date = ?, parking = ?, length = ?, difficulty = ?, description = ?, custom_field1 = ?, custom_field2 = ? WHERE id = ?',
        [
          hike.name,
          hike.location,
          hike.date,
          hike.parking,
          hike.length,
          hike.difficulty,
          hike.description,
          hike.custom_field1,
          hike.custom_field2,
          hike.id,
        ],
        (_, result) => resolve(result.rowsAffected),
        (_, err) => reject(err)
      );
    });
  });
};

export const getAllHikes = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM hikes',
        [],
        (_, { rows: { _array } }) => {
          resolve(_array); 
        },
        (_, err) => reject(err)
      );
    });
  });
};

export const deleteHike = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM hikes WHERE id = ?',
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, err) => reject(err)
      );
    });
  });
};

export const deleteAllHikes = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM hikes',
        [],
        (_, result) => resolve(result.rowsAffected),
        (_, err) => reject(err)
      );
    });
  });
};