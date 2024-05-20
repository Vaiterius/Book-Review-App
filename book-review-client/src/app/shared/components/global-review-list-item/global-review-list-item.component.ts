import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment.development';
import { GoogleBooksApiService } from '../../services/google-books-api.service';
import { Book, BookDetailsResponse } from '../../interfaces/book';

@Component({
	selector: 'app-global-review-list-item',
	standalone: true,
	imports: [DatePipe, RouterLink],
	templateUrl: './global-review-list-item.component.html',
	styleUrl: './global-review-list-item.component.scss',
})
export class GlobalReviewListItemComponent implements OnInit {
	@Input() id!: number;
	@Input() title!: string;
	@Input() body!: string;
	// @Input() author: string;
	@Input() createdAt!: string;
	@Input() lastUpdatedAt?: string;
	@Input() bookId!: string;
	@Input() rating!: number;
	@Input() tags!: string[];

	public bookDetails!: Book;

	constructor(
		private http: HttpClient,
		private router: Router,
		private googleBooksService: GoogleBooksApiService,
	) {}

	ngOnInit(): void {
		this.searchBookById(this.bookId);
	}

	private url: string = environment.baseUrl + 'api/Reviews';

	public deleteReview(id: number) {
		this.http.delete<any>(`${this.url}/${id}`).subscribe({
			next: () => {
				console.log(`Review #${id} deleted successfully`);
				this.router.navigate(['/reviews']);
			},
			error: (error) => {
				console.error(`Error deleting review #${id}`, error);
			},
		});
	}

	// This will call an API for every review listed in the paginated global feed.
	public searchBookById(bookId: string) {
		this.googleBooksService.getBookById(bookId).subscribe({
			next: (bookResponse: BookDetailsResponse) => {
				console.log(bookResponse);
				this.bookDetails =
					this.googleBooksService.getFormattedBookFromResponse(
						bookResponse,
					);
			},
			error: (error) => console.error(error),
		});
	}
}
