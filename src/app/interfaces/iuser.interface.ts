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
  image: string;
  role: string;
}


// src/app/interfaces/iuser.interface.ts
export interface IUser {
  user_id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  numTel: string;
  gender: 'Hombre' | 'Mujer' | 'Otro';
  image: string | null;
  role: 'user' | 'guide';
  colorPalette: { primary: string; secondary: string; accent: string; background: string } | null;
  availability?: string | null;
}
