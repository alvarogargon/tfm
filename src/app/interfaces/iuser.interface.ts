// For login requests
export interface IUserLogin {
  email: string;
  password: string;
}

// For registration requests
export interface IUserRegister {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  age: number;
  num_tel: number | string; 
  gender: string;
  image?: string;
  role: string;
}


// src/app/interfaces/iuser.interface.ts
export interface IUser {
  user_id: number;
  username: string;
  email?: string; // Ahora opcional
  firstName: string;
  lastName: string;
  age?: number; // Ahora opcional
  numTel?: string; // Ahora opcional
  gender?: 'Hombre' | 'Mujer' | 'Otro'; // Ahora opcional
  image: string | null;
  role: 'user' | 'guide';
  colorPalette: any | null;
  availability: string | null;
}
