import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private _http = inject(HttpClient);
  private urlBase: string = `${environment.API_DOMAIN}${environment.API_PREFIX}`;

  checkHealth(): Observable<any> { 
    return this._http.get(`${this.urlBase}/health`); 
  }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> { 
    return this._http.get<T>(`${this.urlBase}/${endpoint}`, { params }); 
  } 
  
  post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> { 
    return this._http.post<T>(`${this.urlBase}/${endpoint}`, data, { headers }); 
  } 
  
  put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> { 
    return this._http.put<T>(`${this.urlBase}/${endpoint}`, data, { headers }); 
  } 
  
  delete<T>(endpoint: string, params?: HttpParams): Observable<T> { 
    return this._http.delete<T>(`${this.urlBase}/${endpoint}`, { params }); 
  }

  deleteWithBody<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> { 
    return this._http.request<T>('DELETE', `${this.urlBase}/${endpoint}`, { body: data, headers });
  }
}
