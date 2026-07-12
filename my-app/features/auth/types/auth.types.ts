export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt: Date;
}

export interface OtpCode {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  expiresAt: Date;
}
