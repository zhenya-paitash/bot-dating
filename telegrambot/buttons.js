const language = require('./language')

const btnConfig = {
  resize_keyboard: true,
  // resize_keyboard: false,
  one_time_keyboard: false,
}

function toRows(arr, row) {
  const keyboard = []
  for (let i = 0; i < Math.ceil(arr.length / 2); i++)
    keyboard.push(arr.slice(i * row, (i + 1) * row))

  return keyboard
}

/* =============================================================================
    ASK
============================================================================= */

const startBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].welcomeBtn]],
      input_field_placeholder: language[lng].menuTag,
      ...btnConfig,
    }),
  }
}

const languageBtn = lng => {
  const keyboard = toRows(Object.keys(language.languages), 2)

  return {
    reply_markup: JSON.stringify({
      keyboard,
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const ageBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [['18']],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const genderBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].maleBtn, language[lng].femaleBtn]],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const preferenceBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [language[lng].maleBtn, language[lng].femaleBtn],
        [language[lng].irrelevantBtn],
      ],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const locationBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[{ text: language[lng].locationBtn, request_location: true }]],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const locationSelectBtn = (lng, n) => {
  // const keyboardArr = Array.from({ length: n }, (_, i) => String(i + 1))
  const keyboardArr = Array.from(
    { length: n },
    (_, i) => language.digits[i + 1]
  )
  const keyboard = toRows(keyboardArr, 5)

  return {
    reply_markup: JSON.stringify({
      keyboard,
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const nameBtn = (lng, firstname) => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[firstname]],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const photoBtn = (lng, avatar) => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [avatar ? language[lng].profilePhotoBtn : ''],
        [language[lng].defaultPhotoBtn],
      ],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const descriptionBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].skipBtn]],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

/* =============================================================================
    EDIT
============================================================================= */

const editAgeBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [['18'], [language[lng].cancelBtn]],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const editGenderBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [language[lng].maleBtn, language[lng].femaleBtn],
        [language[lng].cancelBtn],
      ],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const editPreferenceBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [language[lng].maleBtn, language[lng].femaleBtn],
        [language[lng].irrelevantBtn],
        [language[lng].cancelBtn],
      ],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const editLocationBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: language[lng].locationBtn, request_location: true }],
        [language[lng].cancelBtn],
      ],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const editNameBtn = (lng, firstname) => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[firstname], [language[lng].cancelBtn]],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const editPhotoBtn = (lng, avatar) => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [avatar ? language[lng].profilePhotoBtn : ''],
        [language[lng].defaultPhotoBtn],
        [language[lng].cancelBtn],
      ],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const editDescriptionBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].skipBtn], [language[lng].cancelBtn]],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

const editBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [
          language[lng].languageField,
          language[lng].ageField,
          language[lng].genderField,
        ],
        [
          language[lng].preferenceField,
          language[lng].locationField,
          language[lng].nameField,
        ],
        [language[lng].descriptionField, language[lng].photoField],
        [language[lng].backBtn],
      ],
      input_field_placeholder: language[lng].askTag,
      ...btnConfig,
    }),
  }
}

/* =============================================================================
    MENU
============================================================================= */

const mainMenuBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [
        [language[lng].searchBtn],
        [language[lng].matchBtn, language[lng].vipBtn],
        [language[lng].editBtn, language[lng].deleteBtn],
      ],
      input_field_placeholder: language[lng].menuTag,
      ...btnConfig,
    }),
  }
}

const deleteWarningBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].deleteAgreeBtn, language[lng].cancelBtn]],
      input_field_placeholder: language[lng].deleteTag,
      ...btnConfig,
    }),
  }
}

const deleteReasonBtn = lng => {
  const inline_keyboard = Array.from(
    { length: Object.keys(language[lng].deleteReasons).length },
    (_, idx) => [
      {
        text: language[lng].deleteReasons[idx + 1],
        callback_data: `delete_reason_${lng}_${idx + 1}`,
      },
    ]
  )

  return {
    reply_markup: JSON.stringify({ inline_keyboard }),
    ...btnConfig,
  }
}

// TODO: переделать все кнопки где только << Назад в 1 fun (lng, tag) {}
const backBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].backBtn]],
      ...btnConfig,
    }),
  }
}

const cancelBtn = lng => {
  return {
    reply_markup: {
      keyboard: [[language[lng].cancelBtn]],
      input_field_placeholder: language[lng].reviewTag,
      ...btnConfig,
    },
  }
}

const matchBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].backBtn]],
      input_field_placeholder: language[lng].matchTag,
      ...btnConfig,
    }),
  }
}

const likeBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      // keyboard: [Object.keys(language.searchBtns), [language[lng].backBtn]],
      keyboard: [[language[lng].backBtn]],
      input_field_placeholder: language[lng].searchTag,
      ...btnConfig,
    }),
  }
}

const likeContinueBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].likeContinueBtn], [language[lng].backBtn]],
      input_field_placeholder: language[lng].searchTag,
      ...btnConfig,
    }),
  }
}

const askVipBtn = lng => {
  return {
    reply_markup: JSON.stringify({
      keyboard: [[language[lng].backBtn]],
      input_field_placeholder: language[lng].vipTag,
      ...btnConfig,
    }),
  }
}

const buyVipBtn = lng => {
  const choice = Object.keys(language.vipPrice)
  const inline_keyboard = choice.map(time => [
    {
      text: String([language[lng][`vip${time}Btn`]]),
      callback_data: `buy_vip_${time}`,
    },
  ])

  return {
    reply_markup: JSON.stringify({
      inline_keyboard,
      input_field_placeholder: language[lng].vipTag,
      ...btnConfig,
    }),
  }
}

/* =============================================================================
    FIELDS
============================================================================= */

const photoNextBtnField = id => {
  return [
    { text: language.photoBtns.next, callback_data: `target_photo_next_${id}` },
  ]
}
const photoPrevBtnField = id => {
  return [
    { text: language.photoBtns.prev, callback_data: `target_photo_prev_${id}` },
  ]
}

const likeDislikeBtnField = id => {
  const [like, dislike] = Object.keys(language.searchBtns)
  return [
    { text: like, callback_data: `target_like_${id}` },
    { text: dislike, callback_data: `target_dislike_${id}` },
  ]
}

const matchBtnField = (previd, nextid) => {
  const [prev, next] = Object.values(language.matchBtns)
  return [
    { text: prev, callback_data: `match_prev_${previd}` },
    { text: next, callback_data: `match_next_${nextid}` },
  ]
}

// const chatBtnField = (id, tid, lng) => {
const chatBtnField = (username, lng) => {
  // return [{ text: language[lng].sendField, callback_data: `send_${id}_${tid}` }]
  return [{ text: language[lng].sendField, callback_data: `send_${username}` }]
}

module.exports = {
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
  deleteReasonBtn,
  backBtn,
  matchBtn,
  likeBtn,
  likeContinueBtn,
  askVipBtn,
  buyVipBtn,

  // FIELDS
  photoNextBtnField,
  photoPrevBtnField,
  likeDislikeBtnField,
  matchBtnField,
  chatBtnField,
}
