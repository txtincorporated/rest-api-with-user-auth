![cf](http://i.imgur.com/7v5ASc8.png) user managment and auth
====

Add User Management, Authentication, JWT

##Description

Create an Express/Mongo App with User Management and Authentication (or okay to add to existing app):

* Create endpoints for signing up (registering) and signing in (log in)
	* Password should not be saved in plain text to database (hash with bcryptjs)
	* Choose an identifying field for the user (e.g. username, email).
		* Don't allow registering with same user identifier
	* return a JWT when signup or signin successful
	* return appropriate error responses
* Protect your "resources" by requiring a valid JWT
* Test above functionality using chai-http

## Bonus

* Introduce the concept of authorization by having one of your resources, or 
a new endpoint if you want, that requires an elevated privilege, aka authorization) **3pts**

##Rubric
* User Management (Sign up): **4pts**
* Authentication( Sign in): **4pts**
* Protect Routes: **4pts**
* Code Quality: **4pts**
* Tests: **4pts**
