// ? MALE
const male = [
  {
    // ! ДАННЫЕ ИЗ ТЕЛЕГРАММ АККАУНТОВ
    id: 111111111,
    username: '<USER_USERNAME>',
    firstname: '<USER_FIRSTNAME>',

    // ! УТОЧНИТЬ МЕСТОПОЛОЖЕНИЯ
    location: {
      name: '<USER_LOCATION_NAME>',
      country: '<USER_LOCATION_COUNTRY>',
      lat: 11.1111111,
      lon: 11.1111111,
    },

    // ? ЭТО МЕНЯТЬ
    language: 'ru',
    age: 11,
    gender: 'male',
    preference: 'female',
    name: '<USER_SHOW_NAME>',
    description: '<USER_SHOW_DESCRIPTION>',
    photo: [
      '<USER_SHOW_PHOTO_1>',
      '<USER_SHOW_PHOTO_2>',
      '<USER_SHOW_PHOTO_3>',
    ],
  },
]

// ? FEMALE
const female = []

const users = [...male, ...female].map(i => {
  if (Math.ceil(Math.random() * 3) % 2) {
    i.vip = {
      status: true,
      from: new Date(),
      to: new Date('01.01.2999'),
    }
  }

  return {
    ...i,
    done: true,
    dialog_status: 'menu',
    targets: [],
    match: [],
    target: '',
    isBot: true,
  }
})

// console.log(users.map(i => i.username))
// console.log(users.reduce((acc, cur) => (cur.hasOwnProperty('vip') ? acc + 1 : acc), 0))
module.exports = users
