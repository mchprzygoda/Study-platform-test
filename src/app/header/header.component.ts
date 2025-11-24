import { Component, inject, signal, HostListener } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../features/auth/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isAccountMenuOpen = signal(false);
  
  // Pobierz dane użytkownika
  currentUser = this.authService.userSignal();

  toggleAccountMenu(): void {
    this.isAccountMenuOpen.update(value => !value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    // Zamknij menu jeśli kliknięto poza nim
    if (this.isAccountMenuOpen() && !target.closest('.account-menu-container')) {
      this.isAccountMenuOpen.set(false);
    }
  }

  onLogout(): void {
    this.isAccountMenuOpen.set(false);
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout:', err);
      }
    });
  }
}