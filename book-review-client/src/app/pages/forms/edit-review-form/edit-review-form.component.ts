import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';

import { Review } from '../../../shared/interfaces/review';
import { environment } from '../../../../environments/environment.development';
import { Book, BookDetailsResponse } from '../../../shared/interfaces/book';
import { GoogleBooksApiService } from '../../../shared/services/google-books-api.service';

@Component({
	selector: 'app-edit-review-form',
	standalone: true,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		InputTextModule,
		InputTextareaModule,
		InputNumberModule,
		ButtonModule,
		ChipsModule,
	],
	templateUrl: './edit-review-form.component.html',
	styleUrl: './edit-review-form.component.scss',
})
export class EditReviewFormComponent implements OnInit {
	public title?: string; // View title displayed on template.
	public form!: FormGroup;
	public review?: Review;
	public bookId!: string;

	public bookDetails!: Book;

	constructor(
		private googleBooksService: GoogleBooksApiService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private http: HttpClient,
	) {}

	ngOnInit() {
		this.form = new FormGroup({
			title: new FormControl(''),
			body: new FormControl(''),
			rating: new FormControl(null),
			tags: new FormControl([]),
		});
		this.loadData();
		this.bookId = this.activatedRoute.snapshot.paramMap.get('book-id')!;
		this.searchBookById(this.bookId);
	}

	loadData() {
		// Retrieve the ID of the review itself.
		var idParam = this.activatedRoute.snapshot.paramMap.get('id');
		var id = idParam ? +idParam : 0;

		// Fetch the review from the server.
		var url = environment.baseUrl + 'api/Reviews/' + id;
		this.http.get<Review>(url).subscribe({
			next: (result) => {
				this.review = result;
				this.title = 'Edit Review #' + this.review.id;

				// Update form with the review values.
				this.form.patchValue(this.review);
			},
			error: (error) => console.error(error),
		});
	}

	public onSubmit() {
		var review = this.review;
		if (!review) {
			return;
		}

		review.title = this.form.controls['title'].value;
		review.body = this.form.controls['body'].value;
		review.rating = +this.form.controls['rating'].value;
		review.tags = this.form.controls['tags'].value;

		var url = environment.baseUrl + 'api/Reviews/' + review.id;
		this.http.put<Review>(url, review).subscribe({
			next: (result) => {
				console.log('Review #' + review!.id + ' has been updated!');

				// Go back to reviews view.
				this.router.navigate(['/books', this.bookDetails.id], {
					fragment: 'bottom',
				});
			},
			error: (error) => console.error(error),
		});
	}

	// TODO transfer the create/edit forms into the book pages themselves.
	// Get book details on the create review form.
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
