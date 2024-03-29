﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace book_review_server.Data.Models
{
    [Table("Reviews")]
    public class Review
    {
        [Key]
        public required int Id { get; set; }

        // TODO
        // Foreign key.
        //[Required]
        //[ForeignKey(nameof(User))]
        //public required int AuthorId { get; set; }

        [Required]
        public required DateTime CreatedAt { get; set; }

        public DateTime LastUpdatedAt { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Title too long")]
        public required string Title { get; set; }

        [Required]
        [StringLength(7500, ErrorMessage = "Message body too long")]
        public required string Body { get; set; }

        [Required]
        [Range(1.0, 10.0, ErrorMessage = "Rating must be between 1 and 10 with increments of 0.1")]
        public required decimal Rating { get; set; }

        [Url]
        [MaxLength(2048, ErrorMessage = "Invalid URL length")]
        public string? ImageUrl { get; set; }

        public ICollection<Tag>? Tags { get; } = [];
    }
}
