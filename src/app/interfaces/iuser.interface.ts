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

// For user objects returned by the API (response)
export interface IUser {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  numTel: number | string;
  gender: string;
  image: string;
  availability: string;
  role: string;
  colorPalette: {
    accent?: string;
    primary: string;
    secondary: string;
    background?: string;
  }
}
