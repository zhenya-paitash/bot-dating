const axios = require('axios')

const { SECRET_TOKEN: TOKEN, SERVER_URL: URL } = process.env
axios.defaults.headers.common = { Authorization: `Bearer ${TOKEN}` }

// AXIOS REQUIREST
const apiRequest = async (method, url, data) => {
  try {
    const res = await axios({ method, url, data })
    // TODO: comment next line
    console.log(res.data.message.green)
    return res.data
  } catch (e) {
    console.error(e.response?.data?.message.magenta || e)
    return e
  }
}

/* =============================================================================
    /api/users
============================================================================= */

// GET  /api/user
// GET ALL USERS
const getUsers = async () => {
  const user = await apiRequest('GET', `${URL}/api/user`)
  return user?.data
}

// GET  /api/user/:id
// GET USER BY ID
const getUserById = async id => {
  const user = await apiRequest('GET', `${URL}/api/user/${id}`)
  return user?.data
}

// GET  /api/user
// GET LIST POTENTIAL PARTNERS
const getPotentialPartnereUsers = async id => {
  const user = await apiRequest('GET', `${URL}/api/user/${id}/search`)
  return user?.data
}

// POST /api/user/create
// CREATE NEW USER
const createUser = async msg => {
  const { id, first_name: firstname, username } = msg.from
  const user = await apiRequest('POST', `${URL}/api/user`, {
    id,
    firstname,
    username,
  })

  // if (user?.response?.status === 400) return null

  return user?.data
}

// PUT  /api/user/:id
// UPDATE USER INFO
const updateUser = async (id, data) => {
  const user = await apiRequest('PUT', `${URL}/api/user/${id}`, data)
  return user?.data
}

// DELETE /api/user/:id
// DELETE USER
const deleteUser = async id => {
  const user = await apiRequest('DELETE', `${URL}/api/user/${id}`)
  return user?.data
}

/* =============================================================================
    /api/review
============================================================================= */

// GET /api/review
// GET ALL REVIEWS
const getReviews = async () => {
  const reviews = await apiRequest('GET', `${URL}/api/review`)
  return reviews?.data
}

// POST /api/review
// CREATE NEW REVIEW
const createReview = async (userId, review) => {
  const newReview = await apiRequest('POST', `${URL}/api/review`, {
    user: userId,
    review,
  })
  return newReview?.data
}

/* =============================================================================
    /api/links
============================================================================= */

// GET /api/link
// GET ALL LINK
const getLinks = async () => {
  const links = await apiRequest('GET', `${URL}/api/link`)
  return links?.data
}

// GET  /api/link/:id
// GET MATCH LINKS WITH ID
const getLinksWithId = async id => {
  const user = await apiRequest('GET', `${URL}/api/link/${id}`)
  return user?.data
}

// POST /api/link
// CREATE NEW LINK
const createLink = async (uid, targetid, isLiked) => {
  const newLink = await apiRequest('POST', `${URL}/api/link`, {
    uid,
    targetid,
    isLiked,
  })
  return {
    data: newLink?.data,
    isMatch: newLink?.isMatch,
  }
}

/* =============================================================================
    /api/statistic
============================================================================= */

// POST /api/statistic
// CREATE DAY STATISTIC
const createBotDayStatistic = async () => {
  const reviews = await apiRequest('POST', `${URL}/api/statistic`)
  return reviews?.data
}

// PUT  /api/statistic/user/:id
// UPDATE USER STATISTIC
const updateUserStatistic = async (id, field) => {
  const data = { field }
  const stat = await apiRequest('PUT', `${URL}/api/statistic/user/${id}`, data)
  return stat?.data
}

/* =============================================================================
    /api/vip
============================================================================= */

// GET /api/vip
// CREATE DAY STATISTIC
// ? сделать по-возможности проверку на предыдущию оплату при регистрации
// const getVipPayments = async data => {
//   const pay = await apiRequest('GET', `${URL}/api/vip`, data)
//   return pay?.data
// }

// POST  /api/vip
// CREATE VIP PAYMENT
const createVipPayment = async data => {
  const pay = await apiRequest('POST', `${URL}/api/vip`, data)
  return pay?.data
}

/* =============================================================================
    THIRD PARTY APIS
============================================================================= */

// GET  api.positionstack.com
// GET CITY BY LAT & LON
// const getCityByLocation = async (lat, lon) => {
//   try {
//     const KEY = process.env.LOCATION_KEY
//     const { data } = await axios.get(
//       `http://api.positionstack.com/v1/reverse?access_key=${KEY}&query=${lat},${lon}`
//     )
//     console.log(data)
//     return data.data[0]?.region
//   } catch (e) {
//     console.error(e)
//   }
// }

// GET nominatim.openstreetmap.org
// DOES THE CITY EXIST
const getLocationByCity = async str => {
  try {
    // function translitRuEn(str) { var magic = function (lit) { var arrayLits = [["а", "a"], ["б", "b"], ["в", "v"], ["г", "g"], ["д", "d"], ["е", "e"], ["ё", "yo"], ["ж", "zh"], ["з", "z"], ["и", "i"], ["й", "j"], ["к", "k"], ["л", "l"], ["м", "m"], ["н", "n"], ["о", "o"], ["п", "p"], ["р", "r"], ["с", "s"], ["т", "t"], ["у", "u"], ["ф", "f"], ["х", "h"], ["ц", "c"], ["ч", "ch"], ["ш", "w"], ["щ", "shh"], ["ъ", "''"], ["ы", "y"], ["ь", "'"], ["э", "e"], ["ю", "yu"], ["я", "ya"], ["А", "A"], ["Б", "B"], ["В", "V"], ["Г", "G"], ["Д", "D"], ["Е", "E"], ["Ё", "YO"], ["Ж", "ZH"], ["З", "Z"], ["И", "I"], ["Й", "J"], ["К", "K"], ["Л", "L"], ["М", "M"], ["Н", "N"], ["О", "O"], ["П", "P"], ["Р", "R"], ["С", "S"], ["Т", "T"], ["У", "U"], ["Ф", "F"], ["Х", "H"], ["Ц", "C"], ["Ч", "CH"], ["Ш", "W"], ["Щ", "SHH"], ["Ъ", ""], ["Ы", "Y"], ["Ь", ""], ["Э", "E"], ["Ю", "YU"], ["Я", "YA"], ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["a", "a"], ["b", "b"], ["c", "c"], ["d", "d"], ["e", "e"], ["f", "f"], ["g", "g"], ["h", "h"], ["i", "i"], ["j", "j"], ["k", "k"], ["l", "l"], ["m", "m"], ["n", "n"], ["o", "o"], ["p", "p"], ["q", "q"], ["r", "r"], ["s", "s"], ["t", "t"], ["u", "u"], ["v", "v"], ["w", "w"], ["x", "x"], ["y", "y"], ["z", "z"], ["A", "A"], ["B", "B"], ["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"], ["G", "G"], ["H", "H"], ["I", "I"], ["J", "J"], ["K", "K"], ["L", "L"], ["M", "M"], ["N", "N"], ["O", "O"], ["P", "P"], ["Q", "Q"], ["R", "R"], ["S", "S"], ["T", "T"], ["U", "U"], ["V", "V"], ["W", "W"], ["X", "X"], ["Y", "Y"], ["Z", "Z"]]; var efim360ru = arrayLits.map(i => { if (i[0] === lit) { return i[1] } else { return undefined } }).filter(i => i != undefined); if (efim360ru.length > 0) { return efim360ru[0] } else { return "-" } }; return Array.from(str).map(i => magic(i)).join("") }
    // const translit = translitRuEn(text).replaceAll(' ', '%20')
    const url = encodeURI(
      `https://nominatim.openstreetmap.org/search.php?city=${str}&addressdetails=1&accept_language=ru-RU&format=jsonv2`
    )
    const { data } = await axios.get(url)

    return data
  } catch (e) {
    console.error(e)
    return false
  }
}
// GET CITY BY LAT & LON
const getCityByLocation = async (lat, lon) => {
  try {
    const url = encodeURI(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    )
    const { data } = await axios.get(url)

    return {
      name:
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.name ||
        data?.display_name?.split(',')?.slice(0, 2),
      country: data?.address?.country,
    }
  } catch (e) {
    console.error(e)
    return false
  }
}

module.exports = {
  // USER
  getUsers,
  getUserById,
  getPotentialPartnereUsers,
  createUser,
  updateUser,
  deleteUser,

  // REVIEW
  getReviews,
  createReview,

  // LINK
  getLinks,
  getLinksWithId,
  createLink,

  // STATISTIC
  createBotDayStatistic,
  updateUserStatistic,

  // VIP PAYMENT
  createVipPayment,

  // third party APIs
  getCityByLocation,
  getLocationByCity,
}
