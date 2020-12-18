const isValidEmail = function (email) {
//    if (/^[^@ ]+@[^@ ]+\.[^@ \.]{2,}$/.test(email)) {
  if (/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/.test(email)) {
    return true
  }
  return false
}

const isValidPhone = function (phone) {
  if (/^[\\(]\d{3}[\\)]\s\d{3}-\d{4}$/.test(phone)) {
    return true
  }
  return false
}

function isEmptyString(value) {
  if (/^\s*$/.test(value)) {
    // string is empty or contains only spaces
    return true
  }
  return false
}

export { isValidEmail, isValidPhone, isEmptyString }
