const User = require('../../models/userModel')
const Link = require('../../models/linkModel')

async function getUsersId(user, filter) {
  const { age: $age, location: $location } = filter
  const {
    _id,
    id,
    gender,
    preference,
    age,
    location: { lat, lon },
  } = user

  const links = await Link.find({ uid: _id }, 'targetid').populate(
    'targetid',
    'id'
  )
  const dontNeedArrId = links.map(u => u.targetid.id)

  const q = {
    id: { $nin: [id, ...dontNeedArrId] },
    done: true,
    preference: [gender, 'irrelevant'],
    age: { $gt: age - $age, $lt: age + $age },
    'location.lat': { $lt: lat + $location, $gt: lat - $location },
    'location.lon': { $lt: lon + $location, $gt: lon - $location },
  }
  if (preference !== 'irrelevant') q.gender = [preference]

  return await User.find(q).limit(10).distinct('id')
}

async function findPartners(user) {
  // ? A - сначало ищу с высоким совпадением по даннми, если пользователей нет, то
  // ? B - ищу более с большей разбежкой
  // ? C - ищу пользователей с еще большей разбежкой в анкете
  // ? D - если совпадение вообще нет, кидаю оставшихся пользователей бота
  const configA = { age: 5, location: 2 },
    configB = { age: 11, location: 6 },
    configC = { age: 16, location: 12 },
    configD = { age: 100, location: 100 }

  let users = await getUsersId(user, configA)
  if (!users.length) users = await getUsersId(user, configB)
  if (!users.length) users = await getUsersId(user, configC)
  if (!users.length) users = await getUsersId(user, configD)

  return users
}

function getTargets(users) {
  const newTarget = users[Math.floor(Math.random() * users.length)]
  const newTargets = users.filter(id => id !== +newTarget)

  return [newTarget, newTargets]
}

module.exports = { findPartners, getTargets }
