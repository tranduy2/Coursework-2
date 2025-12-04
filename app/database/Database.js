import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('HikesDB.db');

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
          'runner_name TEXT, ' +
          'weather_condition TEXT, ' +
          'image TEXT' +
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
        'INSERT INTO hikes (name, location, date, parking, length, difficulty, description, runner_name, weather_condition, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          hike.name,
          hike.location,
          hike.date,
          hike.parking,
          hike.length,
          hike.difficulty,
          hike.description,
          hike.runner_name,
          hike.weather_condition,
          hike.image, 
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
        'UPDATE hikes SET name = ?, location = ?, date = ?, parking = ?, length = ?, difficulty = ?, description = ?, runner_name = ?, weather_condition = ?, image = ? WHERE id = ?',
        [
          hike.name,
          hike.location,
          hike.date,
          hike.parking,
          hike.length,
          hike.difficulty,
          hike.description,
          hike.runner_name,
          hike.weather_condition,
          hike.image, 
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
        (_, { rows: { _array } }) => resolve(_array),
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