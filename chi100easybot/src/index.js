import express from "express";
var app = express();
var port = 8080 || process.env.PORT;
app.get("/", function (req, res) {
    res.send("Hi!");
});
app.listen(port, function () {
    // tslint:disable-next-line:no-console
    console.log("server started at http://localhost:" + port);
});
//# sourceMappingURL=index.js.map