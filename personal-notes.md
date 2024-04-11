## STATUS CODES
* 401 - unauthenticated to access a particular route
* 201 - register successful
* 500 - different uses, some of which are (login/register unsuccessful, or generally any action e.g. update-user, failing)
* 200 - login successful

### I wish to test...
* /models/Admin.js
* /controllers/AuthController.js
* /routes/auth.js - (/api/v1/auth/admin) ✅
* /models/Category.js
* /controllers/CategoryController.js
* /routes/category.js = (/api/v1/category/create)
* /middlewares/verifyToken.js