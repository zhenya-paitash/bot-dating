const {
  startBtn,
  languageBtn,
  ageBtn,
  genderBtn,
  preferenceBtn,
  locationBtn,
  locationSelectBtn,
  nameBtn,
  photoBtn,
  descriptionBtn,
  mainMenuBtn,
  editBtn,
  editAgeBtn,
  editNameBtn,
  editPhotoBtn,
  editGenderBtn,
  editPreferenceBtn,
  editLocationBtn,
  editDescriptionBtn,
  cancelBtn,
  deleteWarningBtn,
  likeBtn,

  photoNextBtnField,
  likeDislikeBtnField,
  photoPrevBtnField,
  matchBtn,
  matchBtnField,
  buyVipBtn,
  askVipBtn,
  chatBtnField,
  deleteReasonBtn,
} = require('./buttons')
const {
  getUserById,
  getPotentialPartnereUsers,
  updateUser,
  deleteUser,
  createReview,
  createLink,
  getCityByLocation,
  getLocationByCity,
  getLinksWithId,
  updateUserStatistic,
  createVipPayment,
} = require('./request')
const {
  MYPROFILE,
  CMD_REVIEW,
  LANGUAGE,

  MENU,
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
const language = require('./language')
const moment = require('moment')

/* =============================================================================
    INIT
============================================================================= */

// @desc      При заходе в приложение
// @status    init
const initHandler = async ({ bot, msg, id, lng }) => {
  if (msg.text === language[lng].welcomeBtn) {
    await updateUser(id, { dialog_status: AKS_LANGUAGE })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].welcome, {
    ...startBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

/* =============================================================================
    ASK
============================================================================= */

// @desc      При первом выборе языка
// @dialog    ASK
// @status    ask_language
const languageHandler = async ({ bot, msg, id, lng }) => {
  const { languages } = language
  if (msg.text in languages) {
    lng = languages[msg.text]

    await updateUser(id, { language: lng, dialog_status: ASK_AGE })
    return bot.sendMessage(id, language[lng].age, {
      ...ageBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].language, {
    ...languageBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе возраста
// @dialog    ASK
// @status    ask_age
const ageHandler = async ({ bot, msg, id, lng }) => {
  const age = +msg.text
  if (age >= 18 && age < 100) {
    await updateUser(id, { age, dialog_status: ASK_GENDER })
    return bot.sendMessage(id, language[lng].gender, {
      ...genderBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].age, {
    ...ageBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе пола
// @dialog    ASK
// @status    ask_gender
const genderHandler = async ({ bot, msg, id, lng }) => {
  const genders = {
    [language[lng].maleBtn]: 'male',
    [language[lng].femaleBtn]: 'female',
  }

  if (msg.text in genders) {
    await updateUser(id, {
      gender: genders[msg.text],
      dialog_status: ASK_PREFERENCE,
    })
    msg.text = ''
    return bot.sendMessage(id, language[lng].preference, {
      ...preferenceBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].gender, {
    ...genderBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе предпочтений поиска
// @dialog    ASK
// @status    ask_preference
const preferenceHandler = async ({ bot, msg, id, lng }) => {
  const preferences = {
    [language[lng].maleBtn]: 'male',
    [language[lng].femaleBtn]: 'female',
    [language[lng].irrelevantBtn]: 'irrelevant',
  }

  if (msg.text in preferences) {
    await updateUser(id, {
      preference: preferences[msg.text],
      dialog_status: ASK_LOCATION,
    })
    msg.text = ''
    return bot.sendMessage(id, language[lng].location, {
      ...locationBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].preference, {
    ...preferenceBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе предпочтений местоположения
// @dialog    ASK
// @status    ask_location
const locationHandler = async ({ bot, msg, id, lng }) => {
  let text = msg.text?.trim()

  if (isCommand(msg)) {
    return bot.sendMessage(id, language[lng].location, {
      ...locationBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  if (msg?.location) {
    const { latitude, longitude } = msg.location
    const location = await getCityByLocation(latitude, longitude)

    if (!location?.name || !location.country) {
      msg.text = ''
      return bot.sendMessage(id, language[lng].badLocation, {
        ...locationBtn(lng),
        // parse_mode: 'MarkdownV2',
        parse_mode: 'HTML',
      })
    }

    await updateUser(id, {
      location: {
        name: location.name,
        country: location.country,
        lat: latitude,
        lon: longitude,
      },
      dialog_status: ASK_NAME,
    })

    msg.text = ''
    delete msg.location

    return bot.sendMessage(id, language[lng].name, {
      ...nameBtn(lng, msg.from.first_name),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  } else if (text && text.length > 3 && text.length < 30) {
    const location = await getLocationByCity(text)

    if (!location.length) {
      msg.text = ''
      return bot.sendMessage(id, language[lng].badLocation, {
        ...locationBtn(lng),
        // parse_mode: 'MarkdownV2',
        parse_mode: 'HTML',
      })
    }

    text = text.slice(0, 1).toUpperCase() + text.slice(1)
    const country = location[0].address?.country
    await updateUser(id, {
      location: {
        name: text,
        country,
        lat: location[0].lat,
        lon: location[0].lon,
      },
      dialog_status: location.length === 1 ? ASK_NAME : ASK_LOCATION_SELECT,
    })

    if (location.length > 1) {
      msg.text = ''
      return require('./logic').main(bot, msg)
    }

    msg.text = ''
    return bot.sendMessage(id, language[lng].name, {
      ...nameBtn(lng, msg.from.first_name),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].location, {
    ...locationBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе предпочтений местоположения - Уточнение
// @dialog    ASK
// @status    ask_location_select
const locationSelectHandler = async ({ bot, msg, id, lng, user }) => {
  const { name } = user.location
  const location = await getLocationByCity(name)

  const n = location.length
  const selectArr = location.map(
    (l, idx) =>
      `${language.digits[idx + 1]} ` +
      [
        `<b>${
          l?.address?.city ||
          l.address?.town ||
          l.address?.village ||
          l.name ||
          l.display_name.split(',')[0]
        }</b>`,
        l.address?.municipality ||
          l.address?.county ||
          l.address?.state ||
          l.address?.region,
        l.address?.country,
      ].join(', ')
  )
  const select = `${language[lng].locationSelect}\n\n<i>${selectArr.join(
    '\n'
  )}</i>`

  // const choice = Math.round(+msg.text?.trim())
  const choice =
    Object.entries(language.digits).findIndex(([k, v]) => v === msg.text) + 1
  if (choice >= 1 && choice <= n) {
    const ch = location[choice - 1]
    await updateUser(id, {
      dialog_status: ASK_NAME,
      location: {
        name:
          ch.address?.city ||
          ch.address?.town ||
          ch.address?.village ||
          ch.name ||
          ch.display_name.split(',')[0],
        country: ch.address.country,
        lat: ch.lat,
        lon: ch.lon,
      },
    })

    msg.text = ''
    return bot.sendMessage(id, language[lng].name, {
      ...nameBtn(lng, msg.from.first_name),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  msg.text = ''
  return bot.sendMessage(id, select, {
    ...locationSelectBtn(lng, n),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе именя
// @dialog    ASK
// @status    ask_name
const nameHandler = async ({ bot, msg, id, lng }) => {
  const text = msg.text?.trim()
  if (text && text.length >= 3 && text.length < 30) {
    const name = text.slice(0, 1).toUpperCase() + text.slice(1)
    await updateUser(id, { name, dialog_status: ASK_DESCRIPTION })

    msg.text = ''
    return bot.sendMessage(id, language[lng].description, {
      ...descriptionBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].name, {
    ...nameBtn(lng, msg.from.first_name),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе фото профиля
// @dialog    ASdK
// @status    ask_photo
const photoHandler = async ({ bot, msg, id, user, lng }) => {
  const avatar = await bot.getUserProfilePhotos(id)
  const userPhoto = avatar?.photos[0]?.at(-1)?.file_id

  if (msg.photo) {
    const photo = [msg.photo.at(-1)?.file_id]
    await updateUser(id, { photo, done: true, dialog_status: MENU })
    await updateUserStatistic(id, 'completedRegistration')
    delete msg.photo
    return showMyProfile({ bot, msg, id })
  } else if (msg.text === language[lng].defaultPhotoBtn) {
    const photo = [language.defaultPhoto[user.gender]]
    await updateUser(id, { photo, done: true, dialog_status: MENU })
    await updateUserStatistic(id, 'completedRegistration')
    return showMyProfile({ bot, msg, id })
  } else if (msg.text === language[lng].profilePhotoBtn) {
    await updateUser(id, {
      photo: [userPhoto],
      done: true,
      dialog_status: MENU,
    })
    await updateUserStatistic(id, 'completedRegistration')
    return showMyProfile({ bot, msg, id })
  }

  return bot.sendMessage(id, language[lng].photo, {
    ...photoBtn(lng, userPhoto),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При первом выборе "обо мне"
// @dialog    ASK
// @status    ask_description
const descriptionHandler = async ({ bot, msg, id, lng }) => {
  const text = msg.text?.trim()
  const avatar = await bot.getUserProfilePhotos(id)
  const userPhoto = avatar?.photos[0]?.at(-1)?.file_id

  if (isCommand(msg)) {
    return bot.sendMessage(id, language[lng].description, {
      ...descriptionBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  if (text === language[lng].skipBtn) {
    await updateUser(id, { description: '', dialog_status: ASK_PHOTO })
    return bot.sendMessage(id, language[lng].photo, {
      ...photoBtn(lng, userPhoto),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  } else if (text && text.length > 5 && text.length < 256) {
    await updateUser(id, { description: text, dialog_status: ASK_PHOTO })
    return bot.sendMessage(id, language[lng].photo, {
      ...photoBtn(lng, userPhoto),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].description, {
    ...descriptionBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При изменении готового профиля
// @dialog    ask
// @status    ask_edit
const editHandler = async ({ bot, msg, id, lng }) => {
  const commands = {
    [language[lng].languageField]: EDIT_LANGUAGE,
    [language[lng].ageField]: EDIT_AGE,
    [language[lng].genderField]: EDIT_GENDER,
    [language[lng].preferenceField]: EDIT_PREFERENCE,
    [language[lng].locationField]: EDIT_LOCATION,
    [language[lng].nameField]: EDIT_NAME,
    [language[lng].photoField]: EDIT_PHOTO,
    [language[lng].descriptionField]: EDIT_DESCRIPTION,
    [language[lng].backBtn]: MENU,
  }

  if (msg.text in commands) {
    // await bot.deleteMessage(id, msg.message_id)
    if (msg.text === language[lng].backBtn) {
      await updateUser(id, { dialog_status: commands[msg.text] })
      return showMyProfile({ bot, msg, id })
    }

    await updateUser(id, { done: false, dialog_status: commands[msg.text] })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].editTag, editBtn(lng))
}

// @desc      При попытке удалить профиль
// @dialog    ask
// @status    ask_delete
const deleteHandler = async ({ bot, msg, id, lng }) => {
  if (msg.text === language[lng].cancelBtn) {
    await updateUser(id, { dialog_status: MENU, done: true })
    return showMyProfile({ bot, msg, id })
  }

  if (msg.text === language[lng].deleteAgreeBtn) {
    await deleteUser(id)
    await bot.sendMessage(id, language[lng].deleteAgree, {
      reply_markup: { remove_keyboard: true },
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
    return bot.sendMessage(id, language[lng].deleteReason, {
      ...deleteReasonBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].deleteWarning, {
    ...deleteWarningBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

/* =============================================================================
    EDIT
============================================================================= */

// @desc      При редактировании из меню или команд языка
// @dialog    EDIT
// @status    edit_language
const editLanguageHandler = async ({ bot, msg, id, lng }) => {
  const { languages } = language
  if (msg.text in languages) {
    lng = languages[msg.text]

    await updateUser(id, { language: lng, dialog_status: MENU, done: true })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
      // parse_mode: 'MarkdownV2',
    })
    return showMyProfile({ bot, msg, id })
  }

  return bot.sendMessage(id, language[lng].language, {
    ...languageBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При редактировании из меню возраста
// @dialog    EDIT
// @status    edit_age
const editAgeHandler = async ({ bot, msg, id, lng }) => {
  if (msg.text === language[lng].cancelBtn) return onCancel({ bot, msg, id })

  const age = +msg.text
  if (age >= 18 && age < 100) {
    await updateUser(id, {
      age,
      dialog_status: ASK_EDIT,
      targets: [],
      done: true,
    })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].age, {
    ...editAgeBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При редактировании из меню пола
// @dialog    EDIT
// @status    edit_gender
const editGenderHandler = async ({ bot, msg, id, lng, user }) => {
  if (msg.text === language[lng].cancelBtn) return onCancel({ bot, msg, id })

  const gender = {
    [language[lng].maleBtn]: 'male',
    [language[lng].femaleBtn]: 'female',
  }

  if (msg.text in gender) {
    const newData = {
      gender: gender[msg.text],
      dialog_status: ASK_EDIT,
      targets: [],
      done: true,
    }

    if (Object.values(language.defaultPhoto).includes(...user.photo)) {
      newData.photo = [language.defaultPhoto[newData.gender]]
    }

    await updateUser(id, newData)
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].gender, {
    ...editGenderBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При редактировании из меню предпочтений поиска пола
// @dialog    EDIT
// @status    edit_preference
const editPreferenceHandler = async ({ bot, msg, id, lng }) => {
  if (msg.text === language[lng].cancelBtn) return onCancel({ bot, msg, id })

  const preferences = {
    [language[lng].maleBtn]: 'male',
    [language[lng].femaleBtn]: 'female',
    [language[lng].irrelevantBtn]: 'irrelevant',
  }

  if (msg.text in preferences) {
    await updateUser(id, {
      preference: preferences[msg.text],
      dialog_status: ASK_EDIT,
      done: true,
      targets: [],
    })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].preference, {
    ...editPreferenceBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При редактировании из меню местоположения
// @dialog    EDIT
// @status    edit_location
const editLocationHandler = async ({ bot, msg, id, lng }) => {
  if (msg.text === language[lng].cancelBtn) return onCancel({ bot, msg, id })

  let text = msg.text?.trim()

  if (isCommand(msg)) {
    return bot.sendMessage(id, language[lng].location, {
      ...editLocationBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  if (msg.from.is_bot || text === language[lng].locationField)
    return bot.sendMessage(id, language[lng].location, {
      ...editLocationBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })

  if (msg.location) {
    const { latitude, longitude } = msg.location
    const location = await getCityByLocation(latitude, longitude)

    if (!location?.name || !location.country)
      return bot.sendMessage(id, language[lng].badLocation, {
        ...editLocationBtn(lng),
        // parse_mode: 'MarkdownV2',
        parse_mode: 'HTML',
      })

    await updateUser(id, {
      location: {
        name: location.name,
        country: location.country,
        lat: latitude,
        lon: longitude,
      },
      dialog_status: ASK_EDIT,
      done: true,
      targets: [],
    })
    delete msg.location
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  } else if (text && text.length > 3 && text.length < 30) {
    const location = await getLocationByCity(text)

    if (!location.length)
      return bot.sendMessage(id, language[lng].badLocation, {
        ...editLocationBtn(lng),
        // parse_mode: 'MarkdownV2',
        parse_mode: 'HTML',
      })

    text = text.slice(0, 1).toUpperCase() + text.slice(1)
    const country = location[0].address?.country
    delete msg.location

    await updateUser(id, {
      location: {
        name: text,
        country,
        lat: location[0].lat,
        lon: location[0].lon,
      },
      dialog_status: location.length === 1 ? ASK_EDIT : EDIT_LOCATION_SELECT,
      done: location.length === 1,
      targets: [],
    })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].location, {
    ...editLocationBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При редактировании из меню местоположения - Уточнение
// @dialog    EDIT
// @status    edit_location_select
const editLocationSelectHandler = async ({ bot, msg, id, lng, user }) => {
  const { name } = user.location
  const location = await getLocationByCity(name)

  const n = location.length
  const selectArr = location.map(
    (l, idx) =>
      `${language.digits[idx + 1]} ` +
      [
        `<b>${
          l?.address?.city ||
          l.address?.town ||
          l.address?.village ||
          l.name ||
          l.display_name.split(',')[0]
        }</b>`,
        l.address?.municipality ||
          l.address?.county ||
          l.address?.state ||
          l.address?.region,
        l.address?.country,
      ].join(', ')
  )

  const select = `${language[lng].locationSelect}\n\n<i>${selectArr.join(
    '\n'
  )}</i>`

  // const choice = msg.text?.trim()
  const choice =
    Object.entries(language.digits).findIndex(([k, v]) => v === msg.text) + 1
  if (choice >= 1 && choice <= n) {
    const ch = location[choice - 1]
    await updateUser(id, {
      done: true,
      dialog_status: ASK_EDIT,
      location: {
        name:
          ch.address?.city ||
          ch.address?.town ||
          ch.address?.village ||
          ch.name ||
          ch.display_name.split(',')[0],
        country: ch.address.country,
        lat: ch.lat,
        lon: ch.lon,
      },
      targets: [],
    })
    return require('./logic').main(bot, msg)
  }

  msg.text = ''
  return bot.sendMessage(id, select, {
    ...locationSelectBtn(lng, n),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При редактировании из меню имени
// @dialog    EDIT
// @status    edit_name
const editNameHandler = async ({ bot, msg, id, lng }) => {
  if (msg.text === language[lng].cancelBtn) return onCancel({ bot, msg, id })
  const text = msg.text?.trim()

  if (msg.from.is_bot || text === language[lng].nameField)
    return bot.sendMessage(id, language[lng].name, {
      ...editNameBtn(lng, msg.from.first_name),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })

  if (text && text.length >= 3 && text.length < 30) {
    const name = text.slice(0, 1).toUpperCase() + text.slice(1)
    await updateUser(id, { name, dialog_status: ASK_EDIT, done: true })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].name, {
    ...editNameBtn(lng, msg.from.first_name),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При изменении фото профиля
// @dialog    EDIT
// @status    edit_photo
const editPhotoHandler = async ({ bot, msg, id, user, lng }) => {
  if (msg.text === language[lng].cancelBtn) return onCancel({ bot, msg, id })
  const MAX_PHOTOS = 3

  const avatar = await bot.getUserProfilePhotos(id)
  const userPhoto = avatar?.photos[0]?.at(-1)?.file_id

  if (msg.from.is_bot || msg.text === language[lng].photoField) {
    return bot.sendMessage(id, language[lng].photo, {
      ...editPhotoBtn(lng, userPhoto),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  if (msg.photo) {
    // const photos = msg.photo.map(p => p?.at(-1)?.file_id)
    const photos = msg.photo?.at(-1)?.file_id
    let photo = [photos, ...user.photo]
      .filter(p => !Object.values(language.defaultPhoto).includes(p))
      .slice(0, MAX_PHOTOS)
    delete msg.photo
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })

    if (photo.length === 3) {
      await updateUser(id, { photo, dialog_status: ASK_EDIT, done: true })
      return require('./logic').main(bot, msg)
    }

    await updateUser(id, { photo })
    return await bot.sendMessage(id, language[lng].morePhoto, {
      ...editPhotoBtn(lng, userPhoto),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  } else if (msg.text === language[lng].defaultPhotoBtn) {
    const photo = [language.defaultPhoto[user.gender]]
    await updateUser(id, { photo, done: true, dialog_status: ASK_EDIT })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  } else if (msg.text === language[lng].profilePhotoBtn) {
    let profPhoto = await bot.sendPhoto(id, userPhoto)
    profPhoto = profPhoto?.photo?.at(-1)?.file_id
    // const updPhoto = [profPhoto, ...user.photo]
    //   .filter(p => !Object.values(language.defaultPhoto).includes(p))
    //   .slice(0, MAX_PHOTOS)

    await updateUser(id, {
      photo: [profPhoto],
      done: true,
      dialog_status: ASK_EDIT,
    })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: profPhoto.message_id,
    })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].photo, {
    ...editPhotoBtn(lng, userPhoto),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При изменении доп информации
// @dialog    EDIT
// @status    edit_description
const editDescriptionHandler = async ({ bot, msg, id, lng }) => {
  if (msg.text === language[lng].cancelBtn) return onCancel({ bot, msg, id })

  const text = msg.text?.trim()
  if (msg.from.is_bot || text === language[lng].descriptionField) {
    return bot.sendMessage(id, language[lng].description, {
      ...editDescriptionBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  if (isCommand(msg)) {
    return bot.sendMessage(id, language[lng].description, {
      ...editDescriptionBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  if (text === language[lng].skipBtn) {
    await updateUser(id, {
      description: '',
      dialog_status: ASK_EDIT,
      done: true,
    })
    return require('./logic').main(bot, msg)
  } else if (text && text.length > 5 && text.length < 256) {
    await updateUser(id, {
      description: text,
      dialog_status: ASK_EDIT,
      done: true,
    })
    await bot.sendMessage(id, language[lng].editedTag, {
      reply_to_message_id: msg.message_id,
    })
    return require('./logic').main(bot, msg)
  }

  return bot.sendMessage(id, language[lng].description, {
    ...editDescriptionBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

/* =============================================================================
    МЕНЮ
============================================================================= */

// @desc      Показ пользовательской информации
// @dialog    MENU
// @status    menu
const menuHandler = async ({ bot, msg, id, lng }) => {
  const commands = {
    [language[lng].searchBtn]: SEARCH,
    [language[lng].matchBtn]: MATCH,
    [language[lng].vipBtn]: ASK_VIP,
    [language[lng].editBtn]: ASK_EDIT,
    [language[lng].deleteBtn]: ASK_DELETE,
  }

  if (msg.text in commands) {
    await updateUser(id, { dialog_status: commands[msg.text] })

    switch (msg.text) {
      case language[lng].searchBtn:
        await bot.sendMessage(id, language[lng].searchTag, likeBtn(lng))
        break
      case language[lng].vipBtn:
        await updateUserStatistic(id, 'viewVip')
        await bot.sendMessage(id, language[lng].vipTag, askVipBtn(lng))
        break
      case language[lng].deleteBtn:
        await updateUser(id, { done: false })
        break
    }

    return require('./logic').main(bot, msg)
  }

  // if (msg.from.is_bot) return showMyProfile({ bot, msg, id })
  // return await bot.deleteMessage(id, msg.message_id)
  return showMyProfile({ bot, msg, id })
}

// @desc      При выборе из меню комманд /review, чтобы оставить отзыв
// @dialog    REVIEW
// @status    review
async function reviewHandler({ bot, msg, id, user, lng }) {
  if (msg.text === language[lng].cancelBtn) {
    await updateUser(id, { dialog_status: MENU })
    return showMyProfile({ bot, msg, id })
  }

  if (msg.from.is_bot) {
    return bot.sendMessage(id, language[lng].review, {
      ...cancelBtn(lng),
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  const review = msg.text?.trim()
  if (review && review.length >= 10 && review.length < 264) {
    await createReview(user._id, review)
    await updateUser(id, { dialog_status: MENU })
    return showMyProfile({ bot, msg, id })
  }

  return bot.sendMessage(id, language[lng].review, {
    ...cancelBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

/* =============================================================================
    VIP
============================================================================= */

// @desc      При выборе VIP в меню для покупки вип-статуса
// @dialog    VIP
// @status    ask_vip
async function askVipHandler({ bot, msg, id, user, lng }) {
  if (msg.text === language[lng].backBtn) {
    await updateUser(id, { dialog_status: MENU })
    return showMyProfile({ bot, msg, id })
  }

  if (msg?.successful_payment) return

  if (user.vip?.status) {
    const message = vipTimeLeft(user.vip.to, lng)
    return bot.sendPhoto(id, language.vipImg, {
      caption: message,
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    })
  }

  return bot.sendMessage(id, language[lng].vip, {
    ...buyVipBtn(lng),
    // parse_mode: 'MarkdownV2',
    parse_mode: 'HTML',
  })
}

// @desc      При выборе VIP в меню для покупки вип-статуса. Кнопка купить вип
// @dialog    VIP
// @status    ask_vip + click inline keyboard 'buy_vip_invoice'
async function askVipPayHandler({ bot, msg, id, user, lng }, time) {
  if (msg.text === language[lng].backBtn) {
    await updateUser(id, { dialog_status: MENU })
    return showMyProfile({ bot, msg, id })
  }

  if (user.vip && user.vip.status) return

  // TODO: только для тестового запуска! Давать всем пользователям VIP на 7d
  msg = {
    ...msg,
    successful_payment: { invoice_payload: `buy_vip_7d_ ${id}` },
  }
  await bot.sendMessage(id, language[lng].vipFree, {
    // parse_mode: 'MarkdownV2'
    parse_mode: 'HTML',
  })
  return successfulPaymentHandler({ bot, pay: msg })

  // ! SBERBANG | STRIPE
  // const payToken = process.env.SBERBANK_TESTPAY_KEY
  const payToken = process.env.STRIPE_TESTPAY_KEY

  // ? only for me. After delete this
  if (!payToken || payToken.split(':')[1] !== 'TEST') {
    return bot.sendMessage(
      id,
      'Вы пытаетесь оплатить по рабочему токену. Поправь 😠'
    )
  }

  const description = language[lng].invoiceDescription
  const title = language[lng].invoiceTitle
  const price = +language.vipPrice[time]
  const payload = `buy_vip_${time}_${id}`
  const prices = [
    {
      label: language[lng][`vip${time}Btn`],
      amount: price * 100,
    },
  ]

  return bot.sendInvoice(
    id,
    title,
    description,
    payload,
    payToken,
    // 'USD',
    'rub',
    // 'byn',
    prices,
    {
      photo_url: language.vipImg,
      photo_width: 420,
      photo_height: 420,
      photo_size: 420,
    }
  )
}

// @desc      При выборе VIP в меню для покупки вип-статуса
// @dialog    VIP
// @status    ask_vip
async function successfulPaymentHandler({ bot, pay }) {
  const [time, id] = pay.successful_payment.invoice_payload.split('_').slice(2)

  const now = new Date().getTime()
  const msDay = 1000 * 60 * 60 * 24
  const tarif = {
    '24h': msDay,
    '7d': msDay * 7,
    '30d': msDay * 30,
    '90d': msDay * 90,
  }
  const [from, to] = [new Date(now), new Date(now + tarif[time])]
  const vip = { status: true, from, to }

  await updateUser(id, { dialog_status: MENU, vip })
  await updateUserStatistic(id, 'buyVip')
  // TODO: * Добавить в базу за какую валюту | какой оплатой купили VIP
  await createVipPayment({ tgid: id, tarif: time, from, to })
  // await updateUserStatistic(id, `vip?tarif=${time}&from=${from}&to=${to}`)
  delete pay.successful_payment
  return require('./logic').main(bot, pay)
}

/* =============================================================================
    MATCH
============================================================================= */

// @desc      Для просмотра анкет со взаимным ❤️ + ❤️
// @dialog    MATCH
// @status    match
async function matchHandler({ bot, msg, id, lng, user, match }) {
  if (msg.text === language[lng].backBtn) {
    await updateUser(id, { dialog_status: MENU, match: [] })
    return showMyProfile({ bot, msg, id })
  }

  if (!match || !match.length) {
    match = await getLinksWithId(id)
    if (!match || !match.length) {
      await updateUser(id, { dialog_status: MENU })
      return await bot.sendMessage(id, language[lng].matchEmpty, {
        ...mainMenuBtn(lng),
        // parse_mode: 'MarkdownV2',
        parse_mode: 'HTML',
      })
    }
  }

  await bot.sendMessage(id, language[lng].matchTag, matchBtn(lng))
  return showMatchProfile({ bot, msg, id, lng, match })
}

/* =============================================================================
    ПОИСК ПАРТНЕРОВ
============================================================================= */

// @desc      Поиск пары. Добавление необходимых полей в профиль
// @dialog    SEARCH
// @status    search
async function searchHandler({ bot, msg, id, lng, target }) {
  if (msg.text === language[lng].backBtn) {
    await updateUser(id, { dialog_status: MENU })
    return showMyProfile({ bot, msg, id })
  }

  if (msg.text === language[lng].likeContinueBtn) {
    msg.text = ''
    await bot.sendMessage(id, language[lng].searchTag, likeBtn(lng))
    return require('./logic').main(bot, msg)
  }

  try {
    await bot
      .editMessageMedia(
        {
          type: 'photo',
          media: msg.media,
          caption: newCaption,
        },
        {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          reply_markup: newReplyMarkup,
        }
      )
      .catch(async e => {
        // TODO:
        delete msg.photo
        delete msg.caption
        delete msg.reply_markup

        return require('./logic').main(bot, msg)
      })
  } catch (e) {}

  let targetData
  if (!target) {
    targetData = await getPotentialPartnereUsers(id)
    if (!targetData) {
      await updateUser(id, { dialog_status: MENU, target: '', targets: [] })
      return await bot.sendMessage(
        id,
        language[lng].searchEmpty,
        mainMenuBtn(lng)
      )
    }
  } else {
    targetData = await getUserById(target)
    if (!targetData) {
      await updateUser(id, { target: '' })
      return require('./logic').main(bot, msg)
    }
  }

  return showUserProfile({ bot, msg, id, lng, target: targetData })
}

/* =============================================================================
    ПОКАЗ АНКЕТ
============================================================================= */

// @desc      Показать мой профиль
// @dialog    SHOW MY PROFILE
// @status    menu && /profile
async function showMyProfile({ bot, msg, id }) {
  const user = await getUserById(id)
  if (!user || !user?.done) return require('./logic').main(bot, msg)
  if ([SEARCH, ASK_VIP, ASK_EDIT, MATCH].includes(user.dialog_status)) {
    await updateUser(id, { dialog_status: MENU })
    return require('./logic').main(bot, msg)
  }

  let {
    name,
    age,
    location,
    photo,
    description,
    gender,
    language: lng,
    vip,
  } = user

  const isPhotos = photo.length > 1
  const caption = [
    `${vip?.status ? ' 👑 ' : ''}${name}, ${age}, ${location.name}`,
    description ? description + '\n' : '',
    isPhotos ? '●○○'.slice(0, photo.length) : '',
  ].join('\n')

  await bot.sendMessage(id, language[lng].menuTag, mainMenuBtn(lng))
  const content = isPhotos
    ? {
        caption,
        reply_markup: JSON.stringify({
          inline_keyboard: [photoNextBtnField(id)],
        }),
      }
    : { caption }

  return await bot.sendPhoto(id, photo[0], content).catch(async e => {
    const updPhoto =
      photo.length < 2 ? [language.defaultPhoto[gender]] : photo.slice(1)

    await updateUser(id, { photo: updPhoto })
    return require('./logic').main(bot, msg)
  })
}

// @desc      Показать профиль другого пользователя
// @dialog    SHOW USER PROFILE
// @status    search WHEN user.target
async function showUserProfile({ bot, msg, id, lng, target }) {
  let {
    id: targetid,
    photo,
    gender,
    name,
    age,
    location,
    description,
    updatedAt,
    vip,
    isBot,
  } = target

  const isPhotos = photo.length > 1

  const caption = [
    `${vip?.status ? ' 👑 ' : ''}${
      gender === 'male' ? ' ♂️ ' : ' ♀️ '
    } ${name}, ${age}, ${location.name}`,
    description ? description + '\n' : '',
    getOnline(updatedAt, lng, isBot) + '\n',
    isPhotos ? '●○○'.slice(0, photo.length) : '',
  ].join('\n')

  const content = isPhotos
    ? {
        caption,
        reply_markup: JSON.stringify({
          inline_keyboard: [
            likeDislikeBtnField(targetid),
            photoNextBtnField(targetid),
          ],
        }),
      }
    : {
        caption,
        reply_markup: JSON.stringify({
          inline_keyboard: [likeDislikeBtnField(targetid)],
        }),
      }

  return bot.sendPhoto(id, photo[0], content).catch(async e => {
    const updPhoto =
      photo.length < 2 ? [language.defaultPhoto[gender]] : photo.slice(1)
    await updateUser(targetid, { photo: updPhoto })
    return require('./logic').main(bot, msg)
  })
}

// @desc      Показать профиль пользователей с которыми ❤️ + ❤️
// @dialog    SHOW MATCH USER PROFILE
// @status    match
async function showMatchProfile({ bot, msg, id, lng, match }) {
  const curId = match[0]
  const targetData = await getUserById(curId)
  if (!targetData) {
    await updateUser(id, { match: [...match.filter(i => i !== curId)] })
    return require('./logic').main(bot, msg)
  }

  let {
    id: targetid,
    username,
    photo,
    gender,
    name,
    age,
    location,
    description,
    updatedAt,
    vip,
    isBot,
  } = targetData

  const isPhotos = photo.length > 1

  const caption = [
    `${vip.status ? ' 👑 ' : ''}${
      gender === 'male' ? ' ♂️ ' : ' ♀️ '
    } ${name}, ${age}, ${location.name}`,
    description ? description + '\n' : '',
    getOnline(updatedAt, lng, isBot) + '\n',
    `${language[lng].matchTag}`,
    isPhotos ? '●○○'.slice(0, photo.length) : '',
  ].join('\n')

  const content = isPhotos
    ? {
        caption,
        reply_markup: JSON.stringify({
          inline_keyboard: [
            match.length > 1 ? matchBtnField(match.at(-1), match[1]) : [],
            photoNextBtnField(targetid),
            chatBtnField(username, lng),
          ],
        }),
      }
    : {
        caption,
        reply_markup: JSON.stringify({
          inline_keyboard: [
            match.length > 1 ? matchBtnField(match.at(-1), match[1]) : [],
            chatBtnField(username, lng),
            // [{ text: 'Написать', callback_data: 'click', url: `https://t.me/${username} ` }],
            // [{ text: 'Написать', callback_data: 'click', url: `https://t.me/findyoursoulmate2_bot?link=${username}`  }],
            // [{ text: 'Написать', callback_data: 'click'  }],
          ],
        }),
      }

  return bot.sendPhoto(id, photo[0], content).catch(async e => {
    const updPhoto =
      photo.length < 2 ? [language.defaultPhoto[gender]] : photo.slice(1)
    await updateUser(targetid, { photo: updPhoto })
    return require('./logic').main(bot, msg)
  })
}

/* =============================================================================
    QUERY HANDLER
============================================================================= */

// @desc      Показать профиль пользователя. Изменение изображений
// @dialog    SHOW USER PROFILE << , >> PHOTOS
// @status    menu && /profile
async function queryHandler({ bot, q, user, data }) {
  const { id } = user
  // <<, >> PHOTO
  if (
    q.data.startsWith('target_photo_prev_') ||
    q.data.startsWith('target_photo_next_')
  ) {
    return userPhotoHandler(data)
  }

  // 👍, 👎 TARGET
  if (
    q.data.startsWith('target_like_') ||
    q.data.startsWith('target_dislike_')
  ) {
    return userLikeHandler(data)
  }

  // < prev , next > MATCH
  if (q.data.startsWith('match_prev_') || q.data.startsWith('match_next_')) {
    return userMatchHandler(data)
  }

  // ASK_DELETE > delete_reason
  // if (q.data.startsWith('delete_reason_')) {
  //   // return toggleReasonHandler(data)
  //   return
  // }

  // 🤑 PAY VIP INVOICE
  if (q.data.startsWith('buy_vip_')) {
    if (user.vip && user.vip.status) return
    const time = q.data.split`_`[2]
    return askVipPayHandler(data, time)
  }

  // 'send' CLICK -> CHAT
  if (q.data.startsWith('send_')) {
    const username = q.data.split`_`[1]
    if (!username || username === 'undefined') {
      // TODO: проверить, в теории этот обработчик никогда не сработает
      return bot.sendMessage(id, "Can't find @username")
    }

    await updateUserStatistic(id, 'openDialog')

    return bot.sendMessage(id, `[@${username}](https://t.me/${username})`, {
      // parse_mode: 'MarkdownV2',
      parse_mode: 'markdownv2',
    })
  }
}

/* =============================================================================
    INLINE BUTTONS
============================================================================= */

// @desc      Показать профиль пользователя. Изменение изображений
// @dialog    SHOW USER PROFILE << , >> PHOTOS
// @status    menu && /profile
async function userPhotoHandler({ bot, msg, q, id, lng, user }) {
  const [pos, targetid] = q.data.split('_').slice(2)

  let targetData = user
  if (id !== +targetid) targetData = await getUserById(targetid)
  if (!targetData) return

  const { photo } = targetData
  const match = msg.caption?.slice(-3)?.match(/[●○]/g)
  // if (!match) return require('./logic').main(bot, msg)
  if (!match) return
  const current = match.indexOf('●')
  let newCurrent = +current
  if (pos === 'next') {
    if (newCurrent < photo.length - 1) {
      ++newCurrent
    } else return
  } else {
    if (newCurrent > 0) {
      --newCurrent
    } else return
  }

  const newPhoto = photo[newCurrent] || photo[0]
  const dots = Array.from({ length: photo.length }, (_, idx) =>
    idx === newCurrent ? '●' : '○'
  ).join('')
  const newCaption = msg.caption.slice(0, -match.length) + dots

  // INLINE KEYBOARD
  const newReplyMarkup = { inline_keyboard: [[]] }
  if (newCurrent > 0)
    newReplyMarkup.inline_keyboard[0].push(...photoPrevBtnField(targetid))
  if (newCurrent < photo.length - 1)
    newReplyMarkup.inline_keyboard[0].push(...photoNextBtnField(targetid))

  // TODO:
  if (
    user.dialog_status === SEARCH &&
    +user?.target === targetData?.id &&
    !msg.caption.includes(language[lng].matchBtn)
  ) {
    newReplyMarkup.inline_keyboard.unshift(likeDislikeBtnField(targetid))
  }

  if (msg.caption.includes(language[lng].matchTag)) {
    newReplyMarkup.inline_keyboard.push(chatBtnField(targetData.username, lng))
  }

  if (user.dialog_status === MATCH && user.match && user.match?.length > 1) {
    newReplyMarkup.inline_keyboard.unshift(matchBtnField(targetid))
  }

  return await bot
    .editMessageMedia(
      {
        type: 'photo',
        media: newPhoto,
        caption: newCaption,
      },
      {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: newReplyMarkup,
      }
    )
    .catch(async e => {
      // TODO:
      delete msg.photo
      delete msg.caption
      delete msg.reply_markup

      return require('./logic').main(bot, msg)
    })
}

// @desc      Показать профиль пользователя. Изменение изображений
// @dialog    SHOW USER PROFILE 👍 👎
// @status    search
async function userLikeHandler({ bot, msg, id, lng, q, user }) {
  const [what, targetid] = q.data.split('_').slice(1)
  if (user.dialog_status !== SEARCH || user?.target !== targetid) {
    // return require('./logic').main(bot, msg)
    return
  }

  const targetData = await getUserById(targetid)
  if (!targetData) {
    await updateUser(id, { target: '' })
    return require('./logic').main(bot, msg)
  }

  const res = await createLink(user._id, targetData._id, what === 'like')

  await bot
    .editMessageReplyMarkup(
      {},
      {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
      }
    )
    .catch(async e => {
      // TODO:
      delete msg.photo
      delete msg.caption
      delete msg.reply_markup
      // return require('./logic').main(bot, msg)
    })

  if (res?.isMatch) {
    const tlng = targetData.language
    const targetCaption = `${user.name}, ${user.age}\n\n${
      language[tlng].matchTargetLike
    }\n${language[tlng].matchTag}\t${
      user.photo.length > 1 ? '●○○'.slice(0, user.photo.length) : ''
    }`
    const userCaption = `${targetData.name}, ${targetData.age}\n\n${
      language[lng].matchUserLike
    }\n${language[lng].matchTag}\t${
      targetData.photo.length > 1 ? '●○○'.slice(0, targetData.photo.length) : ''
    }`

    await updateUserStatistic(targetData.id, 'match')
    await updateUserStatistic(id, 'match')

    // TODO: добавить CATCH
    await bot.sendPhoto(targetData.id, user.photo[0], {
      caption: targetCaption,
      // ...likeContinueBtn(tlng),
      reply_markup: JSON.stringify({
        inline_keyboard: [
          (user.photo.length > 1 && photoNextBtnField(id)) || [],
          chatBtnField(user.username, targetData.language),
          // [{ text: 'Написать', url: `tg://user?id=${user.id} ` }],
          // [
          //   {
          //     text: 'Написать',
          //     callback_data: 'click',
          //     url: `https://t.me/${user.username} `,
          //   },
          // ],
        ],
      }),
    })
    // .catch(async e => {
    //   const updTargetPhoto =
    //     targetData.photo.length < 2 ? [language.defaultPhoto[targetData.gender]] : targetData.photo.slice(1)
    //   await updateUser(targetData.id, { photo: updTargetPhoto })
    //   return require('./logic').main(bot, msg)
    // })
    return await bot.sendPhoto(id, targetData.photo[0], {
      caption: userCaption,
      // ...likeContinueBtn(lng),
      reply_markup: JSON.stringify({
        inline_keyboard: [
          (targetData.photo.length > 1 && photoNextBtnField(targetData.id)) ||
            [],
          chatBtnField(targetData.username, lng),
          // [{ text: 'Написать', url: `tg://user?id=${targetData.id} ` }],
          // [
          //   {
          //     text: 'Написать',
          //     callback_data: 'click',
          //     url: `https://t.me/${targetData.username} `,
          //   },
          // ],
        ],
      }),
    })
  }

  return await require('./logic').main(bot, msg)
}

// @desc      Показать профиль пользователя. Изменение изображений
// @dialog    SHOW MATCH USER PROFILE <prev | next>
// @status    menu && /match
async function userMatchHandler({ bot, msg, id, lng, q, user, match }) {
  const [side, targetid] = q.data.split('_').slice(1)

  if (!match) return

  match =
    side === 'next'
      ? [...match.slice(1), match.shift()]
      : [match.pop(), ...match]
  await updateUser(id, { match })

  const curId = match[0]
  const targetData = await getUserById(curId)
  if (!targetData) {
    await updateUser(id, { match: [...match.filter(i => i !== curId)] })
    return require('./logic').main(bot, msg)
  }

  let {
    username,
    photo,
    gender,
    name,
    age,
    location,
    description,
    updatedAt,
    vip,
    isBot,
  } = targetData

  const isPhotos = photo.length > 1

  const caption = [
    `${vip?.status ? ' 👑 ' : ''}${
      gender === 'male' ? ' ♂️ ' : ' ♀️ '
    } ${name}, ${age}, ${location.name}`,
    description,
    getOnline(updatedAt, lng, isBot) + '\n',
    `${language[lng].matchTag}`,
    isPhotos ? '●○○'.slice(0, photo.length) : '',
  ].join('\n')

  const reply_markup = {
    inline_keyboard: [
      match.length > 1 ? matchBtnField(match.at(-1), match[1]) : [],
      isPhotos ? photoNextBtnField(targetData.id) : [],
      chatBtnField(username, lng),
    ],
  }

  return await bot
    .editMessageMedia(
      {
        type: 'photo',
        media: photo[0],
        caption,
      },
      {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup,
      }
    )
    .catch(async e => {
      // TODO:
      delete msg.photo
      delete msg.caption
      delete msg.reply_markup

      return require('./logic').main(bot, msg)
    })
}

// @desc      При отмене редактирование данных профиля
// @dialog    CANCEL
// @status    ... => ask_edit
// async function toggleReasonHandler({ bot, msg, id, lng, q }) {
async function toggleReasonHandler({ bot, q }) {
  const [lng, choice] = q.data.split('_').slice(2)

  await updateUserStatistic(q.message.chat.id, `deleteReasons.${choice}`)

  return await bot.editMessageText(
    language[lng || q.message.from?.language_code || 'ru'].deleteAgrees[choice],
    {
      chat_id: q.message.chat.id,
      message_id: q.message.message_id,
      reply_markup: { inline_keyboard: [] },
      // parse_mode: 'MarkdownV2',
      parse_mode: 'HTML',
    }
  )
}

/* =============================================================================
    ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
============================================================================= */

// @desc      При отмене редактирование данных профиля
// @dialog    CANCEL
// @status    ... => ask_edit
async function onCancel({ bot, msg, id }) {
  await updateUser(id, { dialog_status: ASK_EDIT, done: true })
  return require('./logic').main(bot, msg)
}

// @desc      При редактированиее проверка на команды
// @dialog    EDIT
// @status    CHECK msg.text !== commands
function isCommand(msg) {
  return [MYPROFILE, CMD_REVIEW, LANGUAGE].includes(msg.text)
}

function vipTimeLeft(endTime, lng) {
  const momentLng = {
    ru: 'ru',
    en: 'en',
    ua: 'uk',
  }
  moment.locale(momentLng[lng])

  return language[lng].vipTimeLeft + ` <b>${moment(endTime).fromNow(true)}</b>`
}

function getOnline(time, lng, isBot) {
  // ? можно просто поменять locale в language.languages
  const momentLng = {
    ru: 'ru',
    en: 'en',
    ua: 'uk',
  }
  moment.locale(momentLng[lng])
  if (isBot) {
    return language[lng].onlineNow
  }

  // если меньше 5 минут (300_000 ms)
  if (moment(new Date().getTime()) - moment(time) < 300_000) {
    return language[lng].onlineNow
  }

  return language[lng].online + moment(time).fromNow()
}

// function toMarkdown(str = '') {
//   return str.replace(/[-_.*#+?^$|[\](\){\}]/g, '\\$&')
// }

module.exports = {
  initHandler,
  languageHandler,
  ageHandler,
  genderHandler,
  preferenceHandler,
  locationHandler,
  locationSelectHandler,
  nameHandler,
  descriptionHandler,
  photoHandler,
  menuHandler,
  showMyProfile,
  showUserProfile,
  showMatchProfile,
  userPhotoHandler,
  userLikeHandler,
  userMatchHandler,
  editHandler,
  editLanguageHandler,
  editAgeHandler,
  editGenderHandler,
  editPreferenceHandler,
  editLocationHandler,
  editLocationSelectHandler,
  editNameHandler,
  editDescriptionHandler,
  editPhotoHandler,
  deleteHandler,
  reviewHandler,
  searchHandler,
  matchHandler,
  askVipHandler,
  askVipPayHandler,
  successfulPaymentHandler,
  queryHandler,

  toggleReasonHandler,
}
