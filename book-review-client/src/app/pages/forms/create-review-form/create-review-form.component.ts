import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';

import { environment } from '../../../../environments/environment.development';
import { NewReview } from '../../../shared/interfaces/review';

@Component({
	selector: 'app-create-review-form',
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
	templateUrl: './create-review-form.component.html',
	styleUrl: './create-review-form.component.scss',
})
export class CreateReviewFormComponent implements OnInit {
	// TODO have "Write A Review" button redirect to book details page with opened component.
	public form!: FormGroup;
	public review?: NewReview;
	public bookId!: string;

	constructor(
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
		this.bookId = this.activatedRoute.snapshot.paramMap.get('book-id')!;
	}

	onSubmit() {
		this.review = {
			title: this.form.controls['title'].value,
			body: this.form.controls['body'].value,
			rating: +this.form.controls['rating'].value,
			bookId: this.bookId,
			tags: this.form.controls['tags'].value,
		};

		var url = environment.baseUrl + 'api/Reviews';
		this.http.post<NewReview>(url, this.review).subscribe({
			next: (result) => {
				console.log('Created a new review!', this.review);

				// TODO Go to the book details page with the new review.
				this.router.navigate(['/reviews']);
			},
			error: (error) => console.error(error),
		});
	}
}
