import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './sso.config';
import { CommonModule } from '@angular/common';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'adfs-auth';

  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) {
    this.configureAuth();
  }

  private async configureAuth() {
    // Configurar OAuth
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();

    // Cargar discovery document
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    // Manejar el evento de token recibido
    this.oauthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        console.log('Token received, redirecting to home');
        this.router.navigate(['/home']);
      }
    });

    // Intentar login automático
    await this.oauthService.tryLogin({
      onTokenReceived: context => {
        console.log('Token received in try login');
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnInit() {
    // Si ya estamos autenticados, ir a home
    if (this.oauthService.hasValidAccessToken()) {
      console.log('Already authenticated, going to home');
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigate(['']);
  }

  get isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}