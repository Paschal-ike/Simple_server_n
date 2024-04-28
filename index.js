const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/users/signup") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const newUser = JSON.parse(body);
        const usersFilePath = path.join(__dirname, 'db', 'users.json');
        let users = [];
        if (fs.existsSync(usersFilePath)) {
          const usersData = fs.readFileSync(usersFilePath, "utf8");
          users = JSON.parse(usersData);
        }
        users.push(newUser);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
      } catch (error) {
        console.error('Error creating user:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === "POST" && req.url === "/users/authenticate") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const credentials = JSON.parse(body);
      const usersFilePath = path.join(__dirname, 'db', 'users.json');
      let users = [];
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
    const usersFilePath = path.join(__dirname, 'db', 'users.json');
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath, "utf8");
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(usersData);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Users not found' }));
    }
  } else if (req.method === "POST" && req.url === "/books") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const newBook = JSON.parse(body);
      const booksFilePath = path.join(__dirname, 'db', 'books.json');
      let books = [];
      if (fs.existsSync(booksFilePath)) {
        const booksData = fs.readFileSync(booksFilePath, "utf8");
        books = JSON.parse(booksData);
      }
      books.push(newBook);
      fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(books));
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/books/")) {
    const bookId = req.url.split("/").pop();
    const booksFilePath = path.join(__dirname, 'db', 'books.json');
    if (fs.existsSync(booksFilePath)) {
      let books = JSON.parse(fs.readFileSync(booksFilePath, "utf8"));
      const updatedBooks = books.filter(book => book.id !== parseInt(bookId));
      fs.writeFileSync(booksFilePath, JSON.stringify(updatedBooks, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedBooks));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Books not found' }));
    }
  } else if (req.method === "POST" && req.url === "/books/loanout") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
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
      } catch (error) {
        console.error('Error loaning out book:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === "POST" && req.url === "/books/return") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
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
      } catch (error) {
        console.error('Error returning book:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } else if (req.method === "PUT" && req.url.startsWith("/books/")) {
    const bookId = req.url.split("/").pop();
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
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

          fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(books[bookIndex]));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Book not found' }));
        }
      } catch (error) {
        console.error('Error updating book:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
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
