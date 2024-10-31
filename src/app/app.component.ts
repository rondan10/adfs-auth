import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OAuthService} from 'angular-oauth2-oidc';
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
export class AppComponent implements OnInit   {

    title = 'adfs-auth';
    
    constructor(
      private oauthService: OAuthService,
      private router: Router
    ) {
      this.configureSingleSignOn();
    }
  
    async ngOnInit() {
      await this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.router.navigate(['/home']);
        }
      });
    }
  
    configureSingleSignOn() {
      this.oauthService.configure(authCodeFlowConfig);
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    }
  
    login() {
      this.oauthService.initCodeFlow();
    }
  
    logout() {
      this.oauthService.logOut();
      this.router.navigate(['/login']);
    }
  
    get token() {
      let claims: any = this.oauthService.getIdentityClaims();
      return claims ? claims : null;
    }
  }