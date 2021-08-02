import http from 'http'
import mysql from 'mysql'

const con = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "admin",
    database: "camagru"
});
//
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {
    //set the request route
    if (req.url === "/api" && req.method === "GET") {
        //response headers
        res.writeHead(200, { "Content-Type": "application/json" });
        //set the response
        res.write("Hi there, This is a Vanilla Node.js API");
        //end the response
        res.end();

    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});