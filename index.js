const http = require("http");
const fs = require("fs");
const { v4 } = require("uuid");

const options = {
  "Content-Type": "application/json",
};

function read_file(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function write_file(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const app = http.createServer((req, res) => {
  if (req.url === "/register" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      const { username, email, password } = data;

      const fileData = read_file("auth.json");

      if (!username || !email || !password) {
        res.writeHead(400, options);
        return res.end(JSON.stringify({ message: "All fields required" }));
      }

      if (!email.endsWith("@gmail.com")) {
        res.writeHead(400, options);
        return res.end(JSON.stringify({ message: "Google email required" }));
      }

      if (fileData.find((u) => u.username === username)) {
        res.writeHead(409, options);
        return res.end(JSON.stringify({ message: "Username exists" }));
      }

      if (fileData.find((u) => u.email === email)) {
        res.writeHead(409, options);
        return res.end(JSON.stringify({ message: "Email exists" }));
      }

      const hashPassword = Buffer.from(password).toString("base64");

      fileData.push({
        id: v4(),
        username,
        email,
        password: hashPassword,
      });

      write_file("auth.json", fileData);

      res.writeHead(201, options);
      res.end(JSON.stringify({ message: "Registered" }));
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});