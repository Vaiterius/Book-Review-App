﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace book_review_server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookUrlToReviewModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BookId",
                table: "Reviews",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookId",
                table: "Reviews");
        }
    }
}
