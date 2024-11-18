##### Bookstore API Documentation #####

This document provides an overview of the API endpoints for both the Bookstore/User Platform and the Admin Dashboard.

Bookstore/User Platform API
User Posts
POST /api/posts: Create a new post with a photo, title, and description.
GET /api/posts: Retrieve a list of all posts.
GET /api/posts/{post_id}: Get details of a specific post.
POST /api/posts/{post_id}/like: Like a post.
GET /api/posts/{post_id}/likes: Get users who liked the post.
POST /api/users/{user_id}/follow: Follow another user.
Shopping Cart
POST /api/cart/add: Add an item to the cart.
GET /api/cart: Get the user's cart details.
DELETE /api/cart/remove/{item_id}: Remove an item from the cart.
User Profile
PUT /api/users/{user_id}/profile: Update user profile details.
POST /api/users/{user_id}/profile-photo: Upload/update profile photo.
GET /api/users/{user_id}: Retrieve user profile information.
Authentication
POST /api/auth/register: Register a new user.
POST /api/auth/login: User login with email and password.
Admin Dashboard API
Book Management
POST /api/books: Add a new book to the bookstore.
GET /api/books: List all books.
GET /api/books/{book_id}: Get details of a specific book.
DELETE /api/books/{book_id}: Remove a book from the platform.
User Content Management
GET /api/admin/posts: Retrieve all user posts.
PUT /api/admin/posts/{post_id}/approve: Approve a user post.
DELETE /api/admin/posts/{post_id}: Delete a user post.
User Management
GET /api/admin/users: List all users.
GET /api/admin/users/{user_id}: Get specific user data.
DELETE /api/admin/users/{user_id}: Delete a user account.
Reporting and Analytics
GET /api/reports/sales: Generate sales report.
GET /api/reports/user-activity: Get user activity report.
Authentication
JWT: Use a token for authentication. Include it in the Authorization header as Bearer <your_token>.
Error Codes
200 OK: Successful request.
400 Bad Request: Invalid request data.
401 Unauthorized: Missing or invalid token.
404 Not Found: Resource not found.
500 Internal Server Error: Server error.# book-store-backend
# BooksStoreBackend
