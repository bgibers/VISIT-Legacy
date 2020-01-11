/**
 * My Title
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent } from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CredentialsViewModel } from '../model/credentialsViewModel';
import { JwtToken } from '../model/jwtToken';
import { RegistrationUserApi } from '../model/registrationUserApi';
import { User } from '../model/user';

import { COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';
import { BASE_PATH } from '../../../../environments/environment';
import { LoggedInUser } from '../model/loggedInUser';
import { IdentityResult } from '../model/identityResult';


export const InterceptorSkipHeader = 'X-Skip-Interceptor';
@Injectable()
export class UserService {

    protected basePath = BASE_PATH;
    public defaultHeaders = new HttpHeaders().set(InterceptorSkipHeader, '');
    public configuration = new Configuration();
    public authSubject = new BehaviorSubject(false);

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string,
                private storage: Storage,
                private platform: Platform,
                @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
        this.platform.ready().then(() => {
            this.ifLoggedIn();
          });
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     *
     *
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public userGetCurrentUser(observe?: 'body', reportProgress?: boolean): Observable<LoggedInUser>;
    public userGetCurrentUser(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<LoggedInUser>>;
    public userGetCurrentUser(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<LoggedInUser>>;
    public userGetCurrentUser(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<LoggedInUser>(`${this.basePath}/User/self`,
            {
                withCredentials: this.configuration.withCredentials,
                headers,
                observe,
                reportProgress
            }
        );
    }

    /**
     *
     *
     * @param credentials
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    // public userLoginUser(credentials: CredentialsViewModel, observe: any = 'body', reportProgress: boolean = false ): Observable<any>;
    // public userLoginUser(credentials: CredentialsViewModel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<JwtToken>>;
    // public userLoginUser(credentials: CredentialsViewModel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<JwtToken>>;
    public userLoginUser(credentials: CredentialsViewModel, observe?: 'body', reportProgress?: boolean): Observable<JwtToken> {
    // public userLoginUser(credentials: CredentialsViewModel, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (credentials === null || credentials === undefined) {
            throw new Error('Required parameter credentials was null or undefined when calling userLoginUser.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<JwtToken>(`${this.basePath}/User/login`,
            credentials,
            {
                withCredentials: this.configuration.withCredentials,
                headers,
                observe,
                reportProgress
            }
        ).pipe(
            tap(async ( res: JwtToken ) => {
                if (res.authToken) {
                    await this.storage.set('ACCESS_TOKEN', res.authToken);
                    await this.storage.set('USER_ID', res.id);
                    await this.storage.set('EXPIRES_IN', res.expiresIn);
                    this.userGetCurrentUser().subscribe(async curr => {
                        curr.userId = res.id;
                        curr.jwtToken = res.authToken;
                        await this.storage.set('USER', res);
                    });
                    this.authSubject.next(true);
                }
            })
        );
    }

    public async logout() {
        await this.storage.remove('ACCESS_TOKEN');
        await this.storage.remove('USER_ID');
        await this.storage.remove('USER');
        await this.storage.remove('EXPIRES_IN');
        this.authSubject.next(false);
    }

    public isLoggedIn() {
        return this.authSubject.value;
    }

    public async getUserToken(): Promise<JwtToken> {
        if (this.isLoggedIn) {
            const token: JwtToken = {
                authToken: await this.storage.get('ACCESS_TOKEN'),
                id: await this.storage.get('USER_ID'),
                expiresIn: await this.storage.get('EXPIRES_IN')
            } as JwtToken;

            return token;
        }
    }

    public async getLoggedInUser(): Promise<LoggedInUser> {
        if (this.isLoggedIn) {
            const user: LoggedInUser = await this.storage.get('USER') as LoggedInUser;
            return user;
        }
    }

    ifLoggedIn() {
        this.storage.get('USER').then((response) => {
          if (response) {
            this.authSubject.next(true);
            console.log(response);
          }
        });
      }

    public async getToken(): Promise<string> {
        return await this.storage.get('ACCESS_TOKEN');
    }

    /**
     *
     *
     * @param user
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public userRegisterUser(user: RegistrationUserApi, observe?: 'body', reportProgress?: boolean): Observable<User>;
    public userRegisterUser(user: RegistrationUserApi, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<User>>;
    public userRegisterUser(user: RegistrationUserApi, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<User>>;
    public userRegisterUser(user: RegistrationUserApi, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (user === null || user === undefined) {
            throw new Error('Required parameter user was null or undefined when calling userRegisterUser.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<User>(`${this.basePath}/User`,
            user,
            {
                withCredentials: this.configuration.withCredentials,
                headers,
                observe,
                reportProgress
            }
        );
    }

        /**
     *
     *
     * @param image
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public userUpdateProfileImage(image?: Blob, observe?: 'body', reportProgress?: boolean): Observable<IdentityResult>;
    public userUpdateProfileImage(image?: Blob, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<IdentityResult>>;
    public userUpdateProfileImage(image?: Blob, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<IdentityResult>>;
    public userUpdateProfileImage(image?: Blob, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            'text/plain',
            'application/json',
            'text/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): void; };
        let useForm = false;
        const convertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        }

        formParams.append('image',  image as any);

        return this.httpClient.post<IdentityResult>(`${this.basePath}/User/update/profileimage`,
            convertFormParamsToString ? formParams.toString() : formParams,
            {
                withCredentials: this.configuration.withCredentials,
                headers,
                observe,
                reportProgress
            }
        );
    }

}
