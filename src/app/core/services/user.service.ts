import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserModel } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<UserModel[]>(`/api/login`);
    }

    register(user: UserModel) {
        return this.http.post(`/users/register`, user);
    }
}
