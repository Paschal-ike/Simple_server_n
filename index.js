const http = require('http');
const fs = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/users/signup") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const newUser = JSON.parse(body);
      let users = [];
      const usersFilePath = path.join(__dirname, 'db', 'users.json');
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, "utf8");
        users = JSON.parse(usersData);
      }
  
      users.push(newUser);
      fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    });
  } else if (req.method === "POST" && req.url === "/users/authenticate") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const credentials = JSON.parse(body);

      let users = [];
      const usersFilePath = path.join(__dirname, 'db', 'users.json'); // Adjusted file path
      if (fs.existsSync(usersFilePath)) {
        const usersData = fs.readFileSync(usersFilePath, "utf8");
        users = JSON.parse(usersData);
      }

      const user = users.find(user => user.email === credentials.email && user.password === credentials.password);

      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Authentication successful', user }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }
    });
  } else if (req.method === "GET" && req.url === "/users") {
    let users = [];
    const usersFilePath = path.join(__dirname, 'db', 'users.json'); // Adjusted file path
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath, "utf8");
      users = JSON.parse(usersData);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.method === "POST" && req.url === "/books") {
    // 1. Create (POST /books)
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const newBook = JSON.parse(body);

      // Read the existing books from db/books.json
      const booksFilePath = path.join(__dirname, 'db', 'books.json');
      let books = [];
      if (fs.existsSync(booksFilePath)) {
        const booksData = fs.readFileSync(booksFilePath, "utf8");
        books = JSON.parse(booksData);
      }

      // Append the new book to the existing books array
      books.push(newBook);

      // Write the updated books array to db/books.json
      fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(books));
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/books/")) {
    // 2. Delete (DELETE /books/:id)
    const bookId = req.url.split("/").pop();

    // Read the existing books from db/books.json
    const booksFilePath = path.join(__dirname, 'db', 'books.json');
    let books = [];
    if (fs.existsSync(booksFilePath)) {
      const booksData = fs.readFileSync(booksFilePath, "utf8");
      books = JSON.parse(booksData);
    }

    // Remove the book with the given id
    const updatedBooks = books.filter(book => book.id !== parseInt(bookId));

    // Write the updated books array to db/books.json
    fs.writeFileSync(booksFilePath, JSON.stringify(updatedBooks, null, 2));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedBooks));
  } else if (req.method === "POST" && req.url === "/books/loanout") {
    // 3. LoanOut (POST /books/loanout)
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const loanedBook = JSON.parse(body);

      // Read the existing books from db/books.json
      const booksFilePath = path.join(__dirname, 'db', 'books.json');
      let books = [];
      if (fs.existsSync(booksFilePath)) {
        const booksData = fs.readFileSync(booksFilePath, "utf8");
        books = JSON.parse(booksData);
      }

      // Read the existing loans from db/loans.json
      const loansFilePath = path.join(__dirname, 'db', 'loans.json');
      let loans = [];
      if (fs.existsSync(loansFilePath)) {
        const loansData = fs.readFileSync(loansFilePath, "utf8");
        loans = JSON.parse(loansData);
      }

      // Remove the loaned book from the books array
      const updatedBooks = books.filter(book => book.id !== loanedBook.id);

      // Add the loaned book to the loans array
      loans.push(loanedBook);

      // Write the updated books array to db/books.json
      fs.writeFileSync(booksFilePath, JSON.stringify(updatedBooks, null, 2));

      // Write the updated loans array to db/loans.json
      fs.writeFileSync(loansFilePath, JSON.stringify(loans, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(loans));
    });
  } else if (req.method === "POST" && req.url === "/books/return") {
    // 4. Return (POST /books/return)
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const returnedBook = JSON.parse(body);

      // Read the existing books from db/books.json
      const booksFilePath = path.join(__dirname, 'db', 'books.json');
      let books = [];
      if (fs.existsSync(booksFilePath)) {
        const booksData = fs.readFileSync(booksFilePath, "utf8");
        books = JSON.parse(booksData);
      }

      // Read the existing loans from db/loans.json
      const loansFilePath = path.join(__dirname, 'db', 'loans.json');
      let loans = [];
      if (fs.existsSync(loansFilePath)) {
        const loansData = fs.readFileSync(loansFilePath, "utf8");
        loans = JSON.parse(loansData);
      }

      // Add the returned book to the books array
      books.push(returnedBook);

      // Remove the returned book from the loans array
      const updatedLoans = loans.filter(loan => loan.id !== returnedBook.id);

      // Write the updated books array to db/books.json
      fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

      // Write the updated loans array to db/loans.json
      fs.writeFileSync(loansFilePath, JSON.stringify(updatedLoans, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(books));
    });
  } else if (req.method === "PUT" && req.url.startsWith("/books/")) {
    // 5. Update (PUT /books/:id)
    const bookId = req.url.split("/").pop();
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const updatedBookData = JSON.parse(body);

      // Read the existing books from db/books.json
      const booksFilePath = path.join(__dirname, 'db', 'books.json');
      let books = [];
      if (fs.existsSync(booksFilePath)) {
        const booksData = fs.readFileSync(booksFilePath, "utf8");
        books = JSON.parse(booksData);
      }

      // Find the index of the book with the given id
      const bookIndex = books.findIndex(book => book.id === parseInt(bookId));

      if (bookIndex !== -1) {
        // Update the book data
        books[bookIndex] = { ...books[bookIndex], ...updatedBookData };

        // Write the updated books array to db/books.json
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books[bookIndex]));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Book not found' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(JSON.stringify({ message: 'Endpoint not found', status: 'failed' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});