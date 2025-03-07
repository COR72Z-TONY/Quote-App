import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
//import path from "path";
//import fs from "fs";

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add custom routes
server.get("/info", (req, res) => {
  const db = router.db.getState();
  res.jsonp(db.info);
});

// Login endpoint
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = router.db.getState();
  const user = db.users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    res.jsonp({
      success: true,
      data: {
        token: user.token,
      },
    });
  } else {
    res.status(401).jsonp({
      success: false,
      data: {
        message: "Access denied.",
      },
    });
  }
});

// Profile endpoint
server.get("/profile", (req, res) => {
  const token = req.query.token;
  const db = router.db.getState();
  const user = db.users.find((user) => user.token === token);

  if (user) {
    res.jsonp({
      success: true,
      data: {
        fullname: user.fullname,
        email: user.email,
      },
    });
  } else {
    res.status(401).jsonp({
      success: false,
      data: {
        message: "Access denied.",
      },
    });
  }
});

// Author endpoint with delay
server.get("/author", (req, res) => {
  const token = req.query.token;
  const db = router.db.getState();
  const user = db.users.find((user) => user.token === token);

  if (user) {
    setTimeout(() => {
      const authors = db.authors;
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];

      res.jsonp({
        success: true,
        data: randomAuthor,
      });
    }, 5000); // 5 second delay
  } else {
    res.status(401).jsonp({
      success: false,
      data: {
        message: "Access denied.",
      },
    });
  }
});

// Quote endpoint with delay
server.get("/quote", (req, res) => {
  const token = req.query.token;
  const authorId = parseInt(req.query.authorId);
  const db = router.db.getState();
  const user = db.users.find((user) => user.token === token);

  if (user) {
    setTimeout(() => {
      const quotes = db.quotes.filter((quote) => quote.authorId === authorId);

      if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        res.jsonp({
          success: true,
          data: randomQuote,
        });
      } else {
        res.status(404).jsonp({
          success: false,
          data: {
            message: "No quotes found for this author.",
          },
        });
      }
    }, 5000); // 5 second delay
  } else {
    res.status(401).jsonp({
      success: false,
      data: {
        message: "Access denied.",
      },
    });
  }
});

// Logout endpoint
server.delete("/logout", (req, res) => {
  const token = req.query.token;
  const db = router.db.getState();
  const user = db.users.find((user) => user.token === token);

  if (user) {
    res.jsonp({
      success: true,
      data: {},
    });
  } else {
    res.status(401).jsonp({
      success: false,
      data: {
        message: "Access denied.",
      },
    });
  }
});

// Use default router
server.use(router);

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
