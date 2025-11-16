import { openDatabase } from 'react-native-sqlite-storage';

// Mở (hoặc tạo) database
const db = openDatabase({ name: 'HikesDB.db', location: 'default' });

// Hàm khởi tạo bảng (chạy một lần khi app mở)
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
        () => resolve(), // Thành công
        (_, err) => reject(err), // Thất bại
      );
    });
  });
};

// Hàm thêm hike
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
        (_, result) => resolve(result.insertId), // Trả về ID
        (_, err) => reject(err),
      );
    });
  });
};

// Hàm cập nhật (Edit) một hike
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
          hike.id, // ID của hike cần cập nhật
        ],
        (_, result) => resolve(result.rowsAffected), // Trả về số hàng bị ảnh hưởng
        (_, err) => reject(err),
      );
    });
  });
};

// Hàm lấy tất cả hikes
export const getAllHikes = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM hikes',
        [],
        (_, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          resolve(temp); // Trả về mảng các hikes
        },
        (_, err) => reject(err),
      );
    });
  });
};

// Hàm xóa một hike
export const deleteHike = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM hikes WHERE id = ?',
        [id],
        (_, result) => resolve(result.rowsAffected),
        (_, err) => reject(err),
      );
    });
  });
};

// Hàm xóa TẤT CẢ hikes (Reset)
export const deleteAllHikes = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM hikes',
        [],
        (_, result) => resolve(result.rowsAffected),
        (_, err) => reject(err),
      );
    });
  });
};