import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	public intercept(
		req: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		// Get the auth token.
		var token = this.authService.getToken();

		// If the token is present, clone the request
		// replacing the original headers with the authorization.
		if (token) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
				},
			});
		}

		// Send the request to the next handler.
		return next.handle(req).pipe(
			catchError((error) => {
				// Perform logout on 401 - Unauthorized HTTP response errors
				if (
					error instanceof HttpErrorResponse &&
					error.status === 401
				) {
					this.authService.logout();
					this.router.navigate(['login']);
				}
				return throwError(() => error);
			}),
		);
	}
}
