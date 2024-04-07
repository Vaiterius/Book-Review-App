import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { PaginatorModule } from 'primeng/paginator';

import { environment } from '../../environments/environment';
import { Review } from './review';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [DatePipe, PaginatorModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
	constructor(private http: HttpClient) {}

	private url: string = environment.baseUrl + 'api/Reviews';
	public reviews!: Review[];

	// Manage paginator state.
	public pageIndex: number = 0;
	public pageSize: number = 10;
	public totalCount!: number;

	ngOnInit() {
		this.getInitialReviews();
	}

	// For every selection interaction with the paginator.
	onPageChange(event: any) {
		this.pageIndex = event.page;
		this.pageSize = event.rows;

		var params = new HttpParams()
			.set('pageIndex', event.page.toString())
			.set('pageSize', event.rows.toString());
		this.http.get<any>(this.url, { params }).subscribe({
			next: (result) => {
				this.reviews = result.data;
				this.pageIndex = result.pageIndex;
				this.pageSize = result.pageSize;
			},
			error: (error) => console.error(error),
		});
	}

	// Initial data to view on page landing.
	getInitialReviews() {
		var params = new HttpParams()
			.set('pageIndex', Number(this.pageIndex).toString())
			.set('pageSize', Number(this.pageSize).toString());
		this.http.get<any>(this.url).subscribe({
			next: (result) => {
				this.reviews = result.data;
				this.pageIndex = result.pageIndex;
				this.pageSize = result.pageSize;
				this.totalCount = result.totalCount;
			},
			error: (error) => console.error(error),
		});
	}
}
