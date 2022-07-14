import axios, { AxiosResponse } from "axios";
import { Config } from "../config";
import AppStore from '../stores/AppStore';

export type IApiMethod = "get" | "post" | "put" | "delete";
export type IApiRole = "user" | "administrator";
export type IApiResponseStatus = "ok" | "error" | "login";

export interface IApiResponse{
    status: IApiResponseStatus;
    data: any;
}

function api(
    method: IApiMethod,
    path: string,
    role: IApiRole,
    data: any | undefined = undefined, 
    attemptToRefreshToken: boolean = true,

): Promise<IApiResponse>{
    return new Promise(resolve => {
        axios({
            method: method,
            baseURL: Config.API_PATH,
            url: path,
            data: data ? JSON.stringify(data) : "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + AppStore.getState().auth.authToken, //TO DO:
            },
        })
        .then(res => handleApiResponse(res, resolve))
        .catch(error => { handleApiError(error, resolve, {
            method,
            path,
            role,
            data,
            attemptToRefreshToken: false
        })})
    })
}

interface IApiArguments{
    method: IApiMethod,
    path: string,
    role: IApiRole,
    data: any | undefined, 
    attemptToRefreshToken: boolean,
}

export function apiForm(
    method: IApiMethod,
    path: string,
    role: IApiRole,
    data: FormData,
    attemptToRefreshToken: boolean = true,
): Promise<IApiResponse> {
    return new Promise(resolve => {
        axios({
            method: method,
            baseURL: Config.API_PATH,
            url: path,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + AppStore.getState().auth.authToken,
            },
        })
        .then(res => handleApiResponse(res, resolve))
        .catch(err => handleApiError(err, resolve, {
            method, path, role, data, attemptToRefreshToken,
        }));
    });
}

function handleApiError(err: any, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void, args: IApiArguments) {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
        if (args.attemptToRefreshToken) {
            refreshToken()
            .then(token => {
                if (!token) {
                    throw {
                        status: 'login',
                        data: 'You must log in again!',
                    };
                }
    
                return token;
            })
            .then(token => {
                AppStore.dispatch({ type: "auth.update", key: "authToken", value: token });
    
                return api(args.method, args.path, args.role, args.data, false);
            })
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                resolve(error);
            });
        } else {
            return resolve({
                status: 'login',
                data: 'Wrong role!',
            });
        }
    } else {
        resolve({
            status: 'error',
            data: err?.response?.data,
        });
    }
}

function handleApiResponse(res: AxiosResponse<any, any>, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void) {
    if (res?.status < 200 || res?.status >= 300) {
        return resolve({
            status: 'error',
            data: res + '',
        });
    }

    resolve({
        status: 'ok',
        data: res.data,
    });
}

function refreshToken(): Promise<string|null> {
    return new Promise(resolve => {
        const role = AppStore.getState().auth.role;

        if ( role === "visitor" ) {
            return resolve(null);
        }

        axios({
            method: "post",
            baseURL: Config.API_PATH,
            url: "/api/auth/" + role + "/refresh",
            headers: {
                "Authorization": "Bearer " + AppStore.getState().auth.refreshToken,
            },
        })
        .then(res => refreshTokenResponseHandler(res, resolve))
        .catch(() => {
            resolve(null);
        });
    });
}

function refreshTokenResponseHandler(res: AxiosResponse<any>, resolve: (value: string | PromiseLike<string | null> | null) => void) {
    if (res.status !== 200) {
        return resolve(null);
    }

    resolve(res.data?.authToken);
}

export default api;