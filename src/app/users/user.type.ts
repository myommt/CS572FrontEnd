export type User = {
  fullname: string,
  email: string,
  password: string,
  picture_url?: string;
};

export type Token = {
  _id: string,
  email: string,
  fullname: string,
  picture_url: string;
};

export interface StandardResponse<T> {
  success: boolean;
  data: T;
}