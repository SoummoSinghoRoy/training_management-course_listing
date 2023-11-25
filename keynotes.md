# Overview: Practice modern js, oop based coding approach for microservices, graphql api with apollo server/ rest api. Using express js as a server side framework. As well as practice microservice software development approach with raw sql query.

* Modern js: use .mjs instead of .js file name extension. 
- Facilities: 
  1. Use .mjs is significant of own project module e.g: server.mjs, middleware.mjs etc. Because it's not all time uses some browser don't support this.
  2. Easily manageable asynchronous task by calling await top level. That means when define .mjs, will be called await outside of async block.
- Awareness:
  1. when used .mjs/.cjs we can't use config package to manage custom environment variable.   
  2. when used .mjs we don't get access any file from any directory in path resolve. so we should use url package with 'fileURLToPath' who will be used to create directory name.

* OOP based coding approach for microservices: this is just coding approach when define a controller code, model code, I followed oop prinicipal. As well as maintain microservices term for bigger business logic.

* Graphql with Apollo-Server: Practice graphql api by used @apollo/server of apollo.

* Microservices: Microservices is software/application architecture pattern. this is bigger level software development approach. We should follow some terms:
  1. Define specific service folder: Every module is specific service and that will divided by specific service. Every service will be separately configured.
  2. Define shared/config: Every service could be used same utility/configuration so this will served from shared folder
  3. Gateway: this is central api endpoint configuration folder. Here will be specified shareable endpoint and this endpoint accept request then forward request based on service. But this is not required when client need specific service instead of all services then we will provide specific api endpoint for specific service not all. When user need all services then we can provide gateway or when client/frontend and backend will be served from same server/origin then we can use gateway/central endpoint. Consider this kind of perspective we should define 'cors' or other required middleware like: cookie-parser, morgan etc centrally as well as specifically. When we will go to central endpoint approach then we should to know request type for which service from client like: suppose i have a central endpoint '/create' and serve user create, product create etc at the request time we should know the type. which service client want to get by this request. We can use central endpoint when client get response for all services at a time.
  - Awarness:
  1. If we want to use central configuration/shareable configuration for all services like: environment variable, db config etc we must use 'path' library who provide access shareable file inside service.
  2. We should re-configured centrally shared/configured asset when will give the client specific service. e.g: db config, env config will be configured for service providing time. Otherwise every service will hold specific configuration.  
  
* SQL note:
  1. SQL injection: if we write sql query directly hacker can inject harm context. So way of preventing injection is query parameterized approach. Where we will write query but value assign part will be parameterized by (?) question mark then pass it's value(dynamically or statically) as a parameter this parameter will be an array.  When invoke query method/function pass this parameter as a 2nd parameter of this method/function. Pass values as a template string it's not good practice.
  2. Establish db connection by createPool instead of createConnection: if we establish db connection by createPool we can keep alive db connection for user but establish db connection use createConnection db connection will lost after one request.
