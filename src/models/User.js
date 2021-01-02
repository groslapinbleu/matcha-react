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
  friends: { }, // Format: {uid : boolean}
  tags: [],
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

export const tags = [
  'sex',
  'love',
  'bondage',
  'romance',
  'movies',
  'literature',
  'theater',
  'cooking',
  'kids', 
  'money',
]

export function isBFriendOfA(userA, userB) {

  if (userA.friends && userB.uid in userA.friends) {
    if (userA.friends[userB.uid]) {
      return true
    } else
      return false
  }
  return null
}
