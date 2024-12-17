import { jwtDecode } from 'jwt-decode';

const permissions = {
  admin: ['/admin', '/user'],
  // admin: [
  //   '/admin',
  //   '/doctor',
  //   '/patients',
  //   '/nurse',
  //   '/treatment',
  //   '/user',
  //   '/lab',
  // ],
  doctor: ['/doctor', '/patients', '/treatment', '/user'],
  nurse: ['/nurse', '/patients', '/user'],
  lab: ['/lab', '/patients', '/user'],
  pharmacist: ['/pharmacy', '/patients', '/user'],
};

const hideFromNav = ['/treatment', '/user'];

export const getUserDetailsFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) return jwtDecode(token);
};

export const isTokenExpired = () => {
  const decodedToken = getUserDetailsFromToken();
  if (decodedToken) {
    const currentTime = Date.now() / 1000;
    console.log({ currentTime }, { decodedTokenTime: decodedToken.exp });
    if (decodedToken.exp < currentTime) {
      return true;
    }
  }
  return false;
};

export const hasPermission = (path, role) => {
  if (role && permissions[role]) {
    return permissions[role].includes(path);
  }
  return false;
};

export const getNavItemsForUser = role => {
  return permissions[role].filter(item => !hideFromNav.includes(item));
};
