# READ ME
## USER ROUTES 
  ** *NOTE:* ** *For best results use Postman.*

### Sign Up (Postman or other full-fledged REST client required):  
1. Select POST method in client
1. Type `api/auth/signup` after hostname
1. Enter new User data as JSON string in request body; following fields required:
  * username
  * password 
1. Hit send
1. New user data will be returned in response body; copy user session token for authenticating requests on protected routes (i.e., `POST`, `PUT` and `DELETE` requests on any route); session token is good until next sign-in

### Sign In:  
1. Select POST method in Postman or other REST client
1. Type `api/auth/signin` after hostname
1. Enter User name and password as JSON string in request body
1. Hit send
1. User session token will be returned in response body; copy token for authenticating requests on protected routes (i.e., `POST`, `PUT` and `DELETE` requests on any route); token is good until next sign-in

### Token Validation:  
1. Select POST method in Postman or other REST client
1. Type `api/auth/validate` after hostname
1. Copy/paste token hash into request body
1. Hit send
1. Validation message will be returned in response body; if validation fails new signin will be required to send `POST`, `PUT` or `DELETE` requests

## AUTHORS ROUTE 
### List Authors:  
1. Type `api/authors` after hostname in nav bar and hit return
1. To filter list by name, add `?` operator plus `name=<Author Name>`
1. To filter list by century, e.g, '19th', etc., `?` plus `centuries=<century ordinal>`

### List Author by ID:  
1. After `api/authors`, include author's `_id` number without quotes as listed in author search
  * Author's works will be listed along with other data

### Add Author (Postman or other full-fledged REST client required):  
**NOTE** that **admin** or **super-user** status is required for POST requests; consult administrator to confirm status

1. Follow instructions above to sign up or sign in as necessary; validate token if unsure it is current
1. In request header panel of Postman, enter 'authorization' in `Key` field and `Bearer <session token>` separated by one space in `Value` field
1. Select POST method in client
1. Enter `api/authors` as ROUTE
1. Enter Author data as JSON string in request body; following fields required:
  * Name
  * Centuries 
1. Hit send

### Update Author (**admin** or **super-user** only) 
1. Follow instructions above to sign up or sign in as necessary; validate token if unsure it is current  
1. In request header panel of Postman, enter 'authorization' in `Key` field and `Bearer <session token>` separated by one space in `Value` field
1. Select PUT method
1. Use `api/authors/` and append Author's `_id` number
1. Enter desired field names and values to change in request body as JSON string
1. Hit send

### Delete Author  
**WARNING:**  
---
**DELETE requests are IRREVERSIBLE; deleted data will be permanently lost**

**NOTE** that **super-user** status is required for DELETE requests

1. Follow instructions above to sign up or sign in as necessary; validate token if unsure it is current  
1. In request header panel of Postman, enter 'authorization' in `Key` field and `Bearer <session token>` separated by one space in `Value` field
1. Same as listing by ID, but select DELETE method in REST client rather than GET
  * DB will return confirmation copy of deleted document   


## BOOKS ROUTE 
### List Books:  
1. Type `api/books` after hostname in nav bar and hit return
1. To filter list by title, add `?` operator plus `title=<Full Book Title>`
1. To filter list by author, e.g, 'Samuel Clemens', etc., `?` plus `author=<Author Name>`
1. To filter list by genre, e.g., 'novel', 'science-fiction', etc., add `?` operator plus `genres=<genre-1 genre-2 ...>`

### List Book by ID:  
1. After `api/books`, include book's `_id` number without quotes as listed in author search
  * Books will be listed with both published author name and name on linked DB author document (e.g., 'Mark Twain' for books published under the name 'Samuel Clemens')

### Add Book (**admin** or **super-user** status required):  
1. Follow instructions above to sign up or sign in as necessary; validate token if unsure it is current  
1. In request header panel of Postman, enter 'authorization' in `Key` field and `Bearer <session token>` separated by one space in `Value` field
1. Select POST method in client
1. Enter `api/books` as ROUTE
1. Enter book data as JSON string in request body; following fields required:
  * Title 
  * Author 
  * authId from related author document 
1. Hit send

### Update Book (**admin** or **super-user** status required):  
1. Follow instructions above to sign up or sign in as necessary; validate token if unsure it is current  
1. In request header panel of Postman, enter 'authorization' in `Key` field and `Bearer <session token>` separated by one space in `Value` field
1. Select PUT method
1. Use `api/books/` and append Book's `_id` number
1. Enter desired field names and values to change in request body as JSON string
1. Hit send

### Delete Book  
**WARNING:**  
---
**DELETE requests are IRREVERSIBLE; deleted data will be permanently lost**

**NOTE** that **super-user** status is required for DELETE requests  

1. Follow instructions above to sign up or sign in as necessary; validate token if unsure it is current  
1. In request header panel of Postman, enter 'authorization' in `Key` field and `Bearer <session token>` separated by one space in `Value` field
1. Same as listing by ID, but select DELETE method in REST client rather than GET
  * DB will return copy of document just deleted