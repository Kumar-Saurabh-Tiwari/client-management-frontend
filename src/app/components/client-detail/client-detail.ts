import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client, ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-detail',
  standalone: false,
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss',
})
export class ClientDetail implements OnInit {
  client: Client | null = null;
  editForm!: FormGroup;
  editMode = false;
  isLoading :boolean = true;
  isSaving = false;
  isDeleting = false;
  showDeleteModal = false;
  errorMessage = '';
  createdDate = '';
  updatedDate = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private fb: FormBuilder,
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

    // Defer initial load to avoid dev-mode ExpressionChanged checks in the same tick.
    setTimeout(() => {
      this.loadClientDetails();
    }, 0);
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      summary: ['', [Validators.required]],
      objectives: ['', [Validators.required]],
      timeline: ['', [Validators.required]],
      budget: ['', [Validators.required]]
    });
  }

  loadClientDetails(): void {
    this.isLoading = true;
    const clientId = this.route.snapshot.paramMap.get('id');
    
    if (!clientId) {
      this.errorMessage = 'No client ID provided';
      this.isLoading = false;
      return;
    }

    this.clientService.getClientById(clientId).subscribe({
      next: (data) => {
        this.client = data;
        this.updateDates();
        this.isLoading = false;
        this.cd.detectChanges(); // 🔥 force update
      },
      error: () => {
        this.errorMessage = 'Failed to load client details';
        this.isLoading = false;
      }
    });
  }

  updateDates(): void {
    const today = new Date();
    this.createdDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.updatedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toggleEditMode(): void {
    this.editMode = true;
    if (this.client) {
      this.editForm.patchValue({
        name: this.client.name,
        email: this.client.email,
        summary: this.client.summary,
        objectives: this.client.objectives,
        timeline: this.client.timeline,
        budget: this.client.budget
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editForm.reset();
    this.errorMessage = '';
  }

  isFieldInvalid(fieldName: string, form: FormGroup): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  saveChanges(): void {
    if (!this.editForm.valid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    this.isSaving = true;
    const clientId = this.client?._id;

    if (!clientId) {
      this.errorMessage = 'Invalid client ID';
      this.isSaving = false;
      return;
    }

    const updatedClient = this.editForm.value;

    this.clientService.updateClient(clientId, updatedClient).subscribe({
      next: (data) => {
        this.client = data;
        this.updateDates();
        this.editMode = false;
        this.errorMessage = '';
        this.isSaving = false;
        window.location.reload(); // Force reload to update dashboard list
      },
      error: () => {
        this.errorMessage = 'Failed to update client. Please try again.';
        this.isSaving = false;
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteConfirmed(): void {
    if (!this.client) return;

    this.isDeleting = true;
    const clientId = this.client._id;

    if (!clientId) {
      this.errorMessage = 'Invalid client ID';
      this.isDeleting = false;
      this.showDeleteModal = false;
      return;
    }

    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.router.navigate(['/clients']);
      },
      error: () => {
        this.errorMessage = 'Failed to delete client. Please try again.';
        this.isDeleting = false;
        this.showDeleteModal = false;
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/clients']);
  }
}
