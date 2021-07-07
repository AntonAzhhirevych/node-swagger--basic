const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const booksRouter = require("./routes/books/books.router");

const PORT = process.env.PORT || 4000;

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ books: [] }).write();

// The definition object defines the root information for API
// Provide a few basic pieces of information

// REQUIRED. This string MUST be the semantic version number of the OpenAPI 
// Specification version that the OpenAPI document uses. 

// An array of Server Objects, which provide connectivity information to a target server. 
// If the servers property is not provided, or is an empty array,
// The default value would be a Server Object with a url value of /.

 //multiple servers can be described
const options = {
  definition:{
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/books/books.swagger*.js"],
};

//initialization js doc
const specs = swaggerJsDoc(options);

//initialization app
const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/books", booksRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
