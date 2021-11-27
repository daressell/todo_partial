import uuid from 'react-native-uuid';

const createdDate = new Date()

export const storage = [
  {id: uuid.v4(), name: "testName", status: 'done', createdAt: createdDate},
  {id: uuid.v4(), name: "some name2", status: 'done', createdAt: createdDate}
]

// localStorage.setItem('items', JSON.stringify(storage))
localStorage.setItem('items', '[]')