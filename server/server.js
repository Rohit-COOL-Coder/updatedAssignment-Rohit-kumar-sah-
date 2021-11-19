const express=require('express');
const fs=require('fs');
const app=express();

app.use(express.json());

const books=JSON.parse(fs.readFileSync('books.json'));

app.use(function(req,res,next){
    res.header('Access-Control-allow-Origin',"*");
    res.header("Access-Control-allow-Methods",'GET,POST,PUT,DELETE');
    res.header("Access-Control-allow-Headers",'Content-Type');
    next();
})

//booklist app client request

//1-default request 
app.get('/',function(req,res){
    res.send('book list app');
})

//2-get all the books
app.get('/api/books',function(req,res){
    res.send(books);
})

//3-get book with isbn
app.get('/api/books/:isbn',function(req,res){
     const book = books.find(b=>b.isbn===Number(req.params.isbn));
     if(book){
         res.send(book)
     }else{
         res.status(400).send('book not found...')
     }
})

//4-add new book 
app.post('/api/addBook',function(req,res){
    const ebook=books.find(b=>b.isbn===Number(req.body.isbn));

    if(ebook){
        res.status(400).send("this isbn already present ");
    }else{
        const book={
            isbn:Number(req.body.isbn),
            author:req.body.author,
            title:req.body.title
        }
        books.push(book);
        fs.writeFileSync("books.json",JSON.stringify(books));
        res.send("book stored...")
    }
})

//5-edit book
app.post('/api/editBook/:isbn',function(req,res){
    const book=books.find(b=>b.isbn===Number(req.params.isbn))

    if(book){
        const index=books.indexOf(book);
        books[index] ={
            isbn: Number(req.params.isbn),
            author:req.body.author,
            title:req.body.title
        }
        fs.writeFileSync("books.json",JSON.stringify(books));
        res.send("book updated")
    }else{
           res.status(400).send("no book with such isbn")
    }
})

//6-delete book
app.delete("/api/deleteBook/:isbn",function(req,res){
    const book = books.find(b=>b.isbn===Number(req.params.isbn));

    if(book){
       const index = books.indexOf(book);
       books.splice(index,1);
       fs.writeFileSync("books.json",JSON.stringify(books));
       res.send("book deleted");
    }else{
         res.status(400).send("no book with such isbn");
    }
})

app.listen(3000,console.log('3000.......'));
