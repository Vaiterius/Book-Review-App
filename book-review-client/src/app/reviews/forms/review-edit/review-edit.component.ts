import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

import { Review } from '../../review';
import { environment } from '../../../../environments/environment.development';

@Component({
	selector: 'app-review-edit',
	standalone: true,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		InputTextModule,
		InputTextareaModule,
		InputNumberModule,
		ButtonModule,
	],
	templateUrl: './review-edit.component.html',
	styleUrl: './review-edit.component.scss',
})
export class ReviewEditComponent implements OnInit {
	public title?: string; // View title displayed on template.
	public form!: FormGroup;
	public review?: Review;

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
			// imageUrl: new FormControl(""),
			// tags: new FormControl([])
		});
		this.loadData();
	}

	loadData() {
		// Retrieve the ID from the 'id' parameter.
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

	onSubmit() {
		var review = this.review;
		if (!review) {
			return;
		}

		review.title = this.form.controls['title'].value;
		review.body = this.form.controls['body'].value;
		review.rating = +this.form.controls['rating'].value;
		// review.imageUrl = this.form.controls['imageUrl'].value;
		// review.tags = this.form.controls['tags'].value;

		var url = environment.baseUrl + 'api/Reviews/' + review.id;
		this.http.put<Review>(url, review).subscribe({
			next: (result) => {
				console.log('Review #' + review!.id + ' has been updated!');

				// Go back to reviews view.
				this.router.navigate(['/reviews']);
			},
			error: (error) => console.error(error),
		});
	}
}