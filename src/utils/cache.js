import Cookies from 'js-cookie'

/**
 * 存储cookies
 */
export function getCookie(TokenKey) {
  return Cookies.get(TokenKey)
}

export function setCookie(TokenKey, token) {
  return Cookies.set(TokenKey, token)
}

export function removeCookie(TokenKey) {
  return Cookies.remove(TokenKey)
}

/**
 * 存储localStorage
 */
export const setLocalStorage = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

export const getLocalStorage = name => {
  if (!name) return
  var value = window.localStorage.getItem(name)
  if (value !== null) {
    try {
      value = JSON.parse(value)
    } catch (e) {
      // value = value
    }
  }
  return value
}

export const removeLocalStorage = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}
