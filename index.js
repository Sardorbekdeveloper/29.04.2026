const http = require("http");
const { type } = require("os");

const app = http.createServer((req, res) => {
  if (req.url == "/register" && req.method === "POST") {
    req.on("data", (chunk) => {
      const data = JSON.parse(chunk);
      const { username, email, password } = data;
      const fileData = read_file("auth.json");

      if (!username || !email || !password) {
        res.writeHead(401, options);
        return res.end(
          JSON.stringify({
            message: "username, email, password are required",
          })
        );
      }

      if (!email.endsWith("@gmail.com")) {
        res.writeHead(401, options);
        return res.end(
          JSON.stringify({
            message: "Google email is required",
          })
        );
      }

      const foundedUsername = fileData.find(
        (user) => user.username === username
      );
      if (foundedUsername) {
        res.writeHead(401, options);
        return res.end(
          JSON.stringify({
            message: "Username already exists",
          })
        );
      }

      const foundedEmail = fileData.find((user) => user.email === email);
      if (foundedEmail) {
        res.writeHead(401, options);
        return res.end(
          JSON.stringify({
            message: "Email already exists",
          })
        );
      }

      const hashPassword = btoa(password);
      fileData.push({
        id: v4(),
        username,
        email,
        password: hashPassword,
      });

      write_file("auth.json", fileData);
      res.writeHead(201, options);
      res.end(
        JSON.stringify({
          message: "Registered",
        })
      );
    });
  }
});
app.listen(3000, () => {
  console.log("Server is running at: " + 3000);
});
