import api from "./api";

export interface SignupPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export const signup = (data: SignupPayload) =>
    api.post("/auth/signup", data);

export const login = (data: LoginPayload) =>
    api.post("/auth/login", data);

export const getProfile = () =>
    api.get("/auth/me");

