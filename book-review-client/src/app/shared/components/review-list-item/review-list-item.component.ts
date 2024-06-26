import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { environment } from '../../../../environments/environment.development';
import { AuthService } from '../../services/auth.service';
import { UserDetails } from '../../interfaces/user-details';

@Component({
	selector: 'app-review-list-item',
	standalone: true,
	imports: [DatePipe, RouterLink, ButtonModule, TagModule],
	templateUrl: './review-list-item.component.html',
	styleUrl: './review-list-item.component.scss',
})
export class ReviewListItemComponent implements OnInit {
	@Input() id!: number;
	@Input() title!: string;
	@Input() body!: string;
	@Input() authorDetails!: UserDetails;
	@Input() createdAt!: string;
	@Input() lastUpdatedAt?: string;
	@Input() bookId!: string;
	@Input() rating!: number;
	@Input() tags!: string[];
	@Input() authorIsViewing!: boolean;

	public isLoggedIn: boolean = false;

	constructor(
		private authService: AuthService,
		private http: HttpClient,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.isLoggedIn = this.authService.isAuthenticated();
	}

	private url: string = environment.baseUrl + 'api/Reviews';

	// TODO refactor common methods with the global version of this component

	public deleteReview(id: number) {
		this.http.delete<any>(`${this.url}/${id}`).subscribe({
			next: () => {
				console.log(`Review #${id} deleted successfully`);
				this.router.navigate(['/books', this.bookId]);
			},
			error: (error) => {
				console.error(`Error deleting review #${id}`, error);
			},
		});
	}

	// Redirect to reviews under the tag that was clicked on.
	public redirectWithTag(tagName: string) {
		this.router.navigate(['/reviews'], { queryParams: { tag: tagName } });
	}
}
