/**
 * Stringifies JS Date object so that it looks like 2022-01-25_13-10-08 ([ISO 8601 format]_hours-minutes-seconds)
 * @param {Date} date
 * @return {string}
 */
function getDateStringifiedToISO8601(date) {
  const year = date.getFullYear()

  let month = date.getMonth() + 1
  if (month < 10) month = '0' + month

  let monthDate = date.getDate()
  if (monthDate < 10) monthDate = '0' + monthDate

  let hours = date.getHours()
  if (hours < 10) hours = '0' + hours

  let minutes = date.getMinutes()
  if (minutes < 10) minutes = '0' + minutes

  let seconds = date.getSeconds()
  if (seconds < 10) seconds = '0' + seconds

  return `${year}-${month}-${monthDate}_${hours}-${minutes}-${seconds}`
}

/**
 * Stringifies JS Date object converted to UTC time so that it looks like 2022-01-25 15:08 ([ISO 8601 format] hours:minutes)
 * @param {Date} date
 * @return {string}
 */
function getDateUTCStringifiedToNiceFormat(date) {
  const year = date.getUTCFullYear()

  let month = date.getUTCMonth() + 1
  if (month < 10) month = '0' + month

  let monthDate = date.getUTCDate()
  if (monthDate < 10) monthDate = '0' + monthDate

  let hours = date.getUTCHours()
  if (hours < 10) hours = '0' + hours

  let minutes = date.getUTCMinutes()
  if (minutes < 10) minutes = '0' + minutes

  return `${year}-${month}-${monthDate} ${hours}:${minutes}`
}

/**
 * @param {string} string
 * @param {number} maxWords
 * @return {string|*}
 */
function trimText(string, maxWords = 20) {
  if (string.length === 0) return ''

  const split = string.split(' ')
  if (split.length <= maxWords) return string

  const resultArr = []
  for (let i = 0; i < maxWords; i++) {
    const word = split[i]

    resultArr.push(word)
  }

  const resultText = resultArr.join(' ')

  return resultText + '...'
}

module.exports = {
  getDateStringifiedToISO8601,
  getDateUTCStringifiedToNiceFormat,
  trimText
}