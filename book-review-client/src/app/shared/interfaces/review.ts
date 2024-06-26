import { UserDetails } from './user-details';

// From the server.
export interface Review {
	id: number;
	authorDetails: UserDetails;
	createdAt: string;
	lastUpdatedAt: string;
	// author: string;
	title: string;
	body: string;
	rating: number;
	bookId: string;
	tags: string[];
	// meta: string[]; // author link, other links
}

// To the server.
export type NewReview = Omit<Review, 'id' | 'createdAt' | 'lastUpdatedAt'>;
