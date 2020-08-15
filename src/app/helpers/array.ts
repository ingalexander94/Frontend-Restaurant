import { Convesation } from '../interface/interfaces';
// Ordenar array de objetos por fecha
export const orderArray = (array: []) => {
  return array.sort((a: any, b: any) => {
    a = new Date(a.date).getTime();
    b = new Date(b.date).getTime();
    return a < b ? -1 : a > b ? 1 : 0;
  });
};

// Poner de primero en la lista de conectados el usuario que envio el ultimo mensaje
export const reordenarArray = (array: any[], idDB: string) => {
  const auxUser = searchUser(array, idDB);
  array = array.filter(user => user.idDB !== idDB);
  array.unshift(auxUser);
  return array;
};

const searchUser = (array:any[], idDB:string) => {
  return array.find(user => user.idDB === idDB);
}

// Crear array con los id's de la conversación 
export const createArrayId = (conversation: Convesation[]) => {
  const idArray = {
    data: []
  }
  conversation.map((msg: any) => idArray.data.push(msg._id))
  return idArray;
}