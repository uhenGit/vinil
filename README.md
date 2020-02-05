For now (february 5, 2020), this is express server for future list of vinil records.
Also it has a mongoose connection to mongoDB, lists of schemas and routes.
I plan on having only one user for the list (like admin), who could add, remove 'n' update list items, so I've added some kind of authentication/authorization (bcryptjs and jsonwebtoken).

In auth folder You must create a default.json with {atlas:{url}, secret:"yoursecret"}
