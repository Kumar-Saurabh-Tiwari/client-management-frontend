import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client, ClientService } from '../../services/client.service';
import { Observable, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-client-dashboard',
  standalone: false,
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.scss',
})
export class ClientDashboard implements OnInit {
  clients: Client[] = [];
  clientData$!: Observable<Client[]>;
  clientForm!: FormGroup;
  showForm = false;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  clientObservable$: Observable<Client[]> | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientService: ClientService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      return;
    }
    // Defer first fetch to the next tick to avoid ExpressionChanged errors in dev mode.
    setTimeout(() => {
      this.fetchClients();
    }, 100);
  }

  initializeForm(): void {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      summary: ['', [Validators.required]],
      objectives: ['', [Validators.required]],
      timeline: ['', [Validators.required]],
      budget: ['', [Validators.required]]
    });
  }

  fetchClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClients().subscribe({
      next: (res) => {
        this.clients = res;
        console.log('Fetched clients:', this.clients);
        this.isLoading = false;
        this.cd.detectChanges(); // 🔥 force update
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unable to load clients';
        this.isLoading = false;
      }
    });
  }

  showAddClientForm(): void {
    this.clientForm.reset();
    this.showForm = true;
    this.errorMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.clientForm.reset();
  }

  addClient(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const newClient = this.clientForm.value as Client;

    this.clientService.createClient(newClient).subscribe({
      next: (data) => {
        this.clients.unshift(data);
        this.isSubmitting = false;
        this.closeForm();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to create client';
        this.isSubmitting = false;
      }
    });
  }

  onFormSubmit(): void {
    this.addClient();
  }

  viewClientDetails(client: Client): void {
    if (client._id) {
      this.router.navigate(['/client-details', client._id]);
    } else {
      this.errorMessage = 'Unable to open client details';
    }
  }
}
