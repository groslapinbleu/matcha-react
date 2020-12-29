export const defaultUserData = {
  email: '',
  username: '',
  firstname: '',
  lastname: '',
  photoURL: null,
  description: '',
  birthday: null,
  gender: 0,
  region: 0,
  preferredGender: 0,
  visible: false,
  roles: { ADMIN: false },
  friends: { 1 : false }, // Format: {uid : boolean}
}

export const genders = [
  'other',
  'female',
  'male',
]

export const regions = [
  'other',
  'Ile-de-France',
  'Hauts-de-France',
  'Bretagne',
  'Normandie',
  'Auvergne-Rhônes-Alpes',
]

export function isBFriendOfA(userA, userB) {
  if (userB.uid in userA.friends) {
    if (userA.friends[userB.uid]) {
      return true
    } else
      return false
  }
  return null
}
