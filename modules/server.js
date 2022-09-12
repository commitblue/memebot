const app = require("express")()
app.get("/", (req, res) => {
    res.send("hi")
})
app.listen(8080, () => {
    console.log("app ready")
})