import { app } from '../../app';

export interface IStorageService {
    get<T>(key: string): T;
    save(key: string, data: any): void;
}

class LocalStorageService implements IStorageService {
    public get<T>(key: string): T {
        let stored = <T>angular.fromJson(localStorage.getItem(key));
        return stored;
    }

    public save(key: string, data: any) {
        localStorage.setItem(key, angular.toJson(data));
    }
}

app.service('localStorageService', LocalStorageService);
