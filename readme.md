# MACH ERP API

This API was designed to serve as a boilerplate for my future applications.

Although it doesn't implement dependency injection, my primary focus was to keep the features as dynamic as possible.

Of course, it’s built on top of Express.

The key feature of this API is how it handles routes. Instead of declaring each route (as you can see in countless Node.js-based APIs out there), it wraps all route files in a setup.js file and then bootstraps them in a function that takes app = express() as a parameter.

Enjoy it!


