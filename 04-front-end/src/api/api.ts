import axios, { AxiosResponse } from "axios";

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
            baseURL: "http://localhost:10000",
            url: path,
            data: data ? JSON.stringify(data) : "",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + "TOKEN WILL GO HERE", //TO DO:
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

function handleApiError (error: any, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void, args: IApiArguments){
    if(error?.response?.status === 401 && args.attemptToRefreshToken){
        const refreshedToken = "Refresh Token Logic here"; //TO DO:
        if(refreshedToken){
            api(args.method,args.path,args.role,args.data, args.attemptToRefreshToken)
            .then(res => resolve(res))
            .catch(err => {
                resolve({
                    status: "login",
                    data: "You must log in again!",
                })
            })
        }
        resolve({
            status: "login",
            data: "You must log in again!",
        })
    }
    if(error?.response?.status === 401 && !args.attemptToRefreshToken){
        resolve({
            status: "login",
            data: "You are not logged in!",
        })
    }

    if(error?.response?.status === 403){
        resolve({
            status: "login",
            data: "Wrong role!",
        })
    }

}

function handleApiResponse (res: AxiosResponse<any, any>, resolve: (value: IApiResponse | PromiseLike<IApiResponse>) => void){
    if(res?.status < 200 || res?.status > 300){
        return resolve({
            status: 'error',
            data: res + "",
        })
    }

    resolve({
        status: "ok",
        data: res.data,
    })
}

export default api;