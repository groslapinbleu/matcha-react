export const defaultUserData = {
  email: '',
  username: '',
  firstname: '',
  lastname: '',
  photoURL: null,
  description: '',
  birthday: null,
  gender: 0, // see genders array below
  region: 0, // see regions array below
  preferredGender: 0,
  visible: false,
  roles: { ADMIN: false },
  friends: {}, // Format: {uid : boolean}
  tags: [], // see tags array below
};

export const genders = [
  'other', // index 0 is the default value
  'female',
  'male',
];

export const regions = [
  'other', // index 0 is the default value
  'Auvergne-Rhônes-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays-de-Loire',
  "Provence-Alpes-Côte d'Azur",
  'Guadeloupe',
  'Martinique',
  'Guyane',
  'La Réunion',
  'Mayotte',
];

export const tags = [
  // there is no default value
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
];

export function isBFriendOfA(userA, userB) {
  if (userA.friends && userB.uid in userA.friends) {
    if (userA.friends[userB.uid]) {
      return true;
    } else return false;
  }
  return null;
}
