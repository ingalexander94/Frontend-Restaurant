export default interface User {
    name?: string;
    email: string;
    password: string;
    role: string;
}

export interface userRedux  {
    uid: string;
    name: string;
    role: string;
    idSocket?: string;
}
 
export interface Convesation {
    _id?: string;
    id: string;
    text: string;
    sender: string;
    receiver: string;
    date: Date;
}
