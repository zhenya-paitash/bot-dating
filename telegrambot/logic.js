const { getUserById, createUser, updateUser } = require('./request')
const {
  initHandler,
  languageHandler,
  ageHandler,
  genderHandler,
  preferenceHandler,
  locationHandler,
  nameHandler,
  descriptionHandler,
  photoHandler,
  editHandler,
  editAgeHandler,
  editGenderHandler,
  editPreferenceHandler,
  editLocationHandler,
  editNameHandler,
  editDescriptionHandler,
  editPhotoHandler,
  deleteHandler,
  reviewHandler,
  editLanguageHandler,
  searchHandler,
  menuHandler,
  showMyProfile,
  editLocationSelectHandler,
  locationSelectHandler,
  matchHandler,
  askVipHandler,
  successfulPaymentHandler,
  queryHandler,
} = require('./handlers')
const language = require('./language')
const {
  INIT,
  MENU,
  REVIEW,
  SEARCH,
  MATCH,

  AKS_LANGUAGE,
  ASK_AGE,
  ASK_GENDER,
  ASK_PREFERENCE,
  ASK_LOCATION,
  ASK_LOCATION_SELECT,
  ASK_NAME,
  ASK_DESCRIPTION,
  ASK_PHOTO,
  ASK_EDIT,
  ASK_DELETE,
  ASK_VIP,

  EDIT_LANGUAGE,
  EDIT_AGE,
  EDIT_GENDER,
  EDIT_PREFERENCE,
  EDIT_LOCATION,
  EDIT_LOCATION_SELECT,
  EDIT_NAME,
  EDIT_DESCRIPTION,
  EDIT_PHOTO,
} = require('./commands')

// /start
async function onStart(bot, msg) {
  return showMyProfile({ bot, msg, id: msg.chat.id })
}

// /help
async function onHelp(bot, msg) {
  // ? HELP
  return main(bot, msg)
}

// /info
async function onInfo(bot, msg) {
  // ? INFO
  return main(bot, msg)
}

// /profile
async function onMyProfile(bot, msg) {
  delete msg.text
  return showMyProfile({ bot, msg, id: msg.chat.id })
}

// /language
async function onLanguage(bot, msg) {
  const user = await getUserById(msg.chat.id)
  if (!user || !user.done) return main(bot, msg)
  await updateUser(user.id, { done: false, dialog_status: EDIT_LANGUAGE })

  return main(bot, msg)
}

// /review
async function onReview(bot, msg) {
  let user = await getUserById(msg.chat.id)
  if (!user || !user.done) return main(bot, msg)
  await updateUser(user.id, { dialog_status: REVIEW })

  return main(bot, msg)
}

// 🤑 PAYMENT
async function onPrecheckoutPayment(bot, pay) {
  // ? Проверить доступна ли услуга, или она уже оплачена или еще что
  const user = await getUserById(pay.from.id)
  let isOk = true
  if (!user || user.vip?.status) isOk = false
  await bot.answerPreCheckoutQuery(pay.id, isOk, {
    error_message: 'Уже оплачено',
  })
}

async function onSuccessfulPayment(bot, pay) {
  return successfulPaymentHandler({ bot, pay })
}

// MAIN
async function main(bot, msg, q = false) {
  let user = await getUserById(msg.chat.id)
  if (!user) {
    user = await createUser(msg)
    if (!user)
      return bot.sendMessage(
        msg.chat.id,
        language[msg.from.language || 'ru'].errorMessage
      )
    return main(bot, msg)
  }

  // Destructuring user fields
  const { id, language: lng, dialog_status, target, match } = user
  const data = {
    bot,
    msg,
    q,
    lng: lng || msg.from.language_code || 'ru',
    id,
    user,
    target,
    match,
  }

  // ? Проверка поля username пользователя, если оно не такое, как приходит в
  // ? сообщении, то обновляется, если его нет - выводит ошибку
  if (user.username !== msg.chat?.username) {
    if (!msg.chat?.username) {
      return bot.sendMessage(msg.chat.id, language[lng].errorMessage)
    }
    await updateUser(id, { username: msg.chat.username })
  }

  // QUERY HANDLER
  if (q) return queryHandler({ bot, q, user, data })

  // ON DIALOG_STATUS
  switch (dialog_status) {
    case INIT:
      return initHandler(data)
    case MENU:
      return menuHandler(data)
    case REVIEW:
      return reviewHandler(data)
    case SEARCH:
      return searchHandler(data)
    case MATCH:
      return matchHandler(data)

    case AKS_LANGUAGE:
      return languageHandler(data)
    case ASK_AGE:
      return ageHandler(data)
    case ASK_GENDER:
      return genderHandler(data)
    case ASK_PREFERENCE:
      return preferenceHandler(data)
    case ASK_LOCATION:
      return locationHandler(data)
    case ASK_LOCATION_SELECT:
      return locationSelectHandler(data)
    case ASK_NAME:
      return nameHandler(data)
    case ASK_DESCRIPTION:
      return descriptionHandler(data)
    case ASK_PHOTO:
      return photoHandler(data)
    case ASK_EDIT:
      return editHandler(data)
    case ASK_DELETE:
      return deleteHandler(data)
    case ASK_VIP:
      return askVipHandler(data)

    case EDIT_LANGUAGE:
      return editLanguageHandler(data)
    case EDIT_AGE:
      return editAgeHandler(data)
    case EDIT_GENDER:
      return editGenderHandler(data)
    case EDIT_PREFERENCE:
      return editPreferenceHandler(data)
    case EDIT_LOCATION:
      return editLocationHandler(data)
    case EDIT_LOCATION_SELECT:
      return editLocationSelectHandler(data)
    case EDIT_NAME:
      return editNameHandler(data)
    case EDIT_DESCRIPTION:
      return editDescriptionHandler(data)
    case EDIT_PHOTO:
      return editPhotoHandler(data)
  }
}

module.exports = {
  onStart,
  onHelp,
  onInfo,
  onMyProfile,
  onLanguage,
  onReview,
  onPrecheckoutPayment,
  onSuccessfulPayment,
  main,
}
