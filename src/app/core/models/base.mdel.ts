import { UserModel } from "./auth.models";

export class ApiResult{
    status: string;
    resultCode: number;
    token: string;
    data: any
}
export class AuthenticateResponse{
    id: string;
    username: string;
    token: string;
    nhanVien: UserModel;
    role: any
}