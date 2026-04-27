import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface Client {
  _id?: string;
  id?: number;
  name: string;
  email: string;
  summary: string;
  objectives: string;
  timeline: string;
  budget: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${API_BASE_URL}/clients`;

  constructor(private http: HttpClient) { }

  /**
   * Get all clients
   */
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  /**
   * Get a single client by ID
   */
  getClientById(id: string | number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new client
   */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  /**
   * Update an existing client
   */
  updateClient(id: string | number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
  }

  /**
   * Delete a client
   */
  deleteClient(id: string | number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search clients by name or email
   */
  searchClients(query: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/search?q=${query}`);
  }
}
