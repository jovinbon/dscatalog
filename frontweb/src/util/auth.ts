import { Role } from 'types/role';
import { getTokenData } from './token';

export const isAuthenticated = (): boolean => {
  const tokenData = getTokenData();
  return tokenData && tokenData.exp * 1000 > Date.now() ? true : false;
};

export const hasAnyRole = (roles: Role[]): boolean => {
  if (roles.length === 0) {
    return true;
  }

  if (getTokenData() !== undefined) {
    return roles.some((role) => getTokenData()?.authorities.includes(role));
  }

  //Ou essa função alternativa

  /*if (getTokenData() !== undefined) {
      for (var i = 0; i < roles.length; i++){
        if (getTokenData()?.authorities.includes(roles[i])){
          return true;
        }
      }
    }*/

  return false;
};
