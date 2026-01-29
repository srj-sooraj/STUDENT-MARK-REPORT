const http = require("http")
const fs = require("fs")
const url = require("url")
const querystring = require("querystring")
const {MongoClient,ObjectId} = require("mongodb")
const client = new MongoClient("mongodb://localhost:27017/")

const server = http.createServer(async(req, res) => {
    const db = client.db('DummyStudents'); 
    const Collection = db.collection('data');
    const { pathname } = url.parse(req.url)

    if (req.method === "GET" && pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(fs.readFileSync("./index.html", "utf8"))
        return
    }
    else if (req.method === "GET" && pathname === "/index.css") {
        res.writeHead(200, { "Content-Type": "text/css" })
        res.end(fs.readFileSync("./index.css", "utf8"))
        return
    }
    else if (req.method === "GET" && pathname === "/form.html") {
    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(fs.readFileSync("./form.html", "utf8"))
    return
}
else if (req.method === "GET" && pathname === "/form.css") {
    res.writeHead(200, { "Content-Type": "text/css" })
    res.end(fs.readFileSync("./form.css", "utf8"))
    return
}
    else if (req.method === "GET" && pathname === "/index.js"){
    res.writeHead(200, { "Content-Type": "text/javascript" })
    res.end(fs.readFileSync("./index.js", "utf8"))
    return
    }
else if(req.method=='POST' && pathname=="/submit"){
    let body = "";
    req.on('data',(chunks)=>{
        console.log(chunks);
        body+=chunks.toString();
        console.log(body);
        
    });   
    req.on("end",async()=>{
        if(body!=null){
            const formdata=querystring.parse(body);
            Collection.insertOne(formdata).then(()=>{
                console.log("success");
                res.writeHead(302, { Location: "/" });
                res.end();
            }).catch((error)=>{
                console.log(error);
                
            });
            console.log(formdata);
            
        }
        
    })
}
else if(req.method == "GET" && pathname == "/getperson"){
    console.log('getperson');
    
    const data = await Collection.find().toArray();
    const maindata = JSON.stringify(data);
    res.writeHead(200,{"content-type":"text/json"});
    res.end(maindata)
}
else if(req.method == "DELETE" && pathname == "/deleteperson"){
    const query = url.parse(req.url, true).query;
    const id = query.id;

    Collection.deleteOne({ _id: new ObjectId(id) })
    .then(()=>{
        res.end("deleted");
    })
    .catch((err)=>{
        console.log(err);
        res.end("error");
    });
}
else if(req.method == "POST" && pathname == "/updateperson"){
    const id = url.parse(req.url, true).query.id;
    let body = "";

    req.on("data",(chunk)=>{
        body += chunk.toString();
    });

    req.on("end",()=>{
        const data = JSON.parse(body);
        Collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
        res.end("updated");
    });
}
    

else {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Not Found")
}


})
client.connect()
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err))
server.listen(3000, () => {
    console.log("Server running on http://localhost:3000")
})