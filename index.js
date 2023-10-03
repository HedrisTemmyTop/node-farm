const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./module/replaceTemplate");
// // Blocking synchronous way
// const hello = "Hello world!";

// console.log(hello);

// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textInput);
// const textOutput = `This us what we know abiyt avoc///ado`;

// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("file written");

// // Non bloocking async

// fs.readFile("./txt/start.txt", "utf-8", (error1, data1) => {
//   if (error1) return console.log(error1, "Error occured");
//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data) => {
//     if (error) console.log(error);
//     console.log(data);

//     fs.readFile(`./txt/append.txt`, "utf-8", (error3, data3) => {
//       if (error3) console.log(error3);
//       console.log(data3);

//       fs.writeFile(
//         `./txt/final.txt`,
//         `${data}\n ${data3}`,
//         "utf-8",
//         (error4) => {
//           if (error4) console.log(error4);
//           else console.log("Your file has been written");
//         }
//       );
//     });
//   });
// });

/////////////////////////////////////////////////////////////////////

// Building web server

console.log(
  slugify("Fresh Avocado", {
    lower: true,
  })
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const dataObject = JSON.parse(data);

const slugs = dataObject.map((item) =>
  slugify(item.productName, {
    lower: true,
  })
);
console.log(slugs);
const server = http.createServer((request, response) => {
  console.log("----------LOGING URL--------------");

  const { query, pathname } = url.parse(request.url, true);
  console.log(query);

  // OVERVIEW PAGE
  if (pathname === "/overview" || pathname === "/") {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });
    // console.log(tempCard);

    const cardHTML = dataObject
      .map((item) => replaceTemplate(tempCard, item))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHTML);
    console.log(cardHTML);
    response.end(output);
  }

  // PRODUCT PAGE
  else if (pathname === "/product") {
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    response.end(output);
  }

  // API PAGE
  else if (pathname === "/api") {
    response.writeHead(200, {
      "Content-type": "application/json",
    });
    response.end(data);
  }

  // NOT FOUND
  else {
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello-world",
    });
    response.end("<h1>Page not found! </h1>");
  }
  /////
  console.log("-----------------------------");
  //   console.log(response);
  //   response.end("Hello from the server");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server is listening on port 8000");
});
