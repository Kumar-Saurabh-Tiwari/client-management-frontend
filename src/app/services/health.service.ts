import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

@Injectable({
    providedIn: 'root'
})
export class HealthService {
    constructor(private http: HttpClient) { }

    /**
     * Check the health of the application
     */
    checkHealth(): Observable<{ status: string }> {
        return this.http.get<{ status: string }>(`${API_BASE_URL}/clients`);
    }
}