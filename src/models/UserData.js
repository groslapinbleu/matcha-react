export const defaultUserData = {
  email: '',
  username: '',
  firstname: '',
  lastname: '',
  photoURL: null,
  description: '',
  gender: 0,
  region: 0,
  preferredGender: 0,
  visible: false,
  roles: { ADMIN: false },
  acceptedFriends: {}, // they asked me and I have accepted. Format: {uid : boolean}
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
