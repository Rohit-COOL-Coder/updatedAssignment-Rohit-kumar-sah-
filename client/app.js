//task 1 -fetch all data from books.json file by calling api/books (GET)
fetchAllBooks();
function fetchAllBooks(){
  fetch(`http://localhost:3000/api/Books`)
  .then(res=> res.json())
  .then(books=> books.forEach(b=> addBookToList(b)))
  .catch(error=> console.error(error))
}

//task-2 - user input data store into books.json file by api/addBook (POST) and then removing table row then
//          need to call fetchAllBook()
document.querySelector("#book-form").addEventListener("submit",e=>{
    e.preventDefault();
    
    const isbn=document.querySelector("#isbn").value;
    const author=document.querySelector("#author").value;
    const title=document.querySelector("#title").value;
     
    //Validation
    if(isbn==""||author==""||title==""){
          alert("please fill all the details...")
    }else{

      const book={
          isbn:isbn,
          title:title,
          author:author
      }

      console.log(book);
      const include={
          method : "POST",
          body : JSON.stringify(book),
          headers: {
            "Content-type": "application/json; charset=UTF-8"}
      }

     fetch(`http://localhost:3000/api/addBook`,include)
     .then(res=>res.json)
     .then(data=> {
        clearTable();
        fetchAllBooks();
        removeFieldData();
     })
     .catch((error)=>console.error("ERROR : ",error))

    }
})

//task-3 - delete book when user click on delete link , then need to call api/deleteBook/:isbn 

function deleteBook(isbn){
    const xHttp = new XMLHttpRequest();
    xHttp.open("DELETE",`http://localhost:3000/api/deleteBook/${isbn}`,false);
    xHttp.send();
    clearTable();
    fetchAllBooks();
}

function addBookToList(book)
  {
     const list=document.querySelector('#book-list');
     const row=document.createElement('tr');
     row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button class="btn btn-danger" onClick="deleteBook(${book.isbn})">Delete</button>
        <button types="button"  class="btn btn-primary" data-toggle="modal"  data-target="#editBookModal" onClick="editBook(${book.isbn})">Edit</button>
        </td>
     `;
     list.appendChild(row);
  }

  function editBook(isbn){
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `http://localhost:3000/api/books/${isbn}`, false);
    xhttp.send();

    const book = JSON.parse(xhttp.responseText);


    document.getElementById('etitle').value = book.title;
    document.getElementById('eauthor').value = book.author;
    document.getElementById('eisbn').value = book.isbn;

    // document.getElementById('editForm').action = `http://localhost:3000/api/editBook/${isbn}`;

}

function searchBook(isbn){
    const xHttp = new XMLHttpRequest();
    xHttp.open("GET",`http://localhost:3000/api/books/${isbn}`,false);
    xHttp.send();
   
    let searchBook="";
    try{
       searchBook=JSON.parse(xHttp.responseText);
    }catch{
        searchBook=undefined;
    }
    
    if(searchBook){
        clearTable();
        addBookToList(searchBook);
    }else{
        alert('no record found');
    }

}

function editUpdate(isbn,title,author){ 
const editedBook={
    isbn:isbn,
    author:author,
    title:title
}

const include={
    method : "POST",
    body : JSON.stringify(editedBook),
    headers: {
      "Content-type": "application/json; charset=UTF-8"}
}

fetch(`http://localhost:3000/api/editBook/${editedBook.isbn}`,include)
.then(res=>res.json)
.then(data=> {
   clearTable();
   fetchAllBooks();
})
.catch((error)=>console.error("ERROR : ",error))
}


  function clearTable() {
    var rowCount = tableEdit.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        tableEdit.deleteRow(i);
    }
  }

  function removeFieldData(){
    const isbn=document.querySelector("#isbn").value="";
    const author=document.querySelector("#author").value="";
    const title=document.querySelector("#title").value="";
  }