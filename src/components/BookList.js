import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookList() {
    const[books,setBooks]=useState([]);
    const[error,setError]=useState(null);

    const[newBook,setNewBook]=useState({
        title: '',
        author: '',
        price: '',
        stock: ''
    });
    const username='admin';
    const password='mypassword123';



    const fetchBooks = () => {
        axios.get('http://localhost:8080/api/books', {
            auth: {
                username: username,
                password: password
            }
        })
        .then(response => {
            setBooks(response.data);
            setError(null); // Clear any previous errors
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            setError('Failed to fetch books. Please check your credentials and try again. ');
        });
    };
     
    useEffect(() => {
        fetchBooks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({...newBook, [name]: value});
    };
    const handleAddBook = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/books', newBook, {
            auth: {
                username: username,
                password: password
            }
        })
        .then(()=> {
            fetchBooks(); // Refresh the book list after adding a new book
            setNewBook({ title: '', author: '', price: '', stock: '' }); // Clear the form      
        })
        .catch(error => {
console.error('Error adding book:', error);
alert('Failed to add book. Please check your credentials and try again.');
        });
    };
       

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
        axios.delete(`http://localhost:8080/api/books/${id}`, {
            auth: {
                username: username,
                password: password
            }
        })
        .then(() =>fetchBooks())
        .catch(error =>console.error('Error deleting book:', error));
            
        }
    };
    return (
        <div style={{padding: '20px'}}>
            <h2>Available Books</h2>
            {/* {ADD BOOK FORM} */}
        <div style={{backgroundColor: '#f9f9f9', padding: '20px', marginBottom: '20px', borderRadius: '5px'}}>
            <h3>Add a New Book</h3>
            <form onSubmit={handleAddBook} style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                <input type="text" name="title" placeholder="Title" value={newBook.title} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <input type="text" name="author" placeholder="Author" value={newBook.author} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <input type="number" name="price" placeholder="Price" value={newBook.price} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <input type="number" name="stock" placeholder="Stock" value={newBook.stock} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <button type="submit">Add Book</button>
            </form>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {books.length===0&&!error?(<p>Loading books...</p>):(
            <table border="1" cellPadding="10" style={{ margin:'0 auto',borderCollapse: 'collapse', width: '100%'}}>
                <thead style={{backgroundColor: '#f2f2f2'}}>
                    <tr>
                    <th>ID</th>
                       <th>Title</th>
                          <th>Author</th>
                             <th>Price</th>
                                <th>Stock</th>
                                </tr>
                                </thead>
                                <tbody>{books.map(book=>(
                                    <tr key={book.id}>
                                        <td>{book.id}</td>
                                           <td>{book.title}</td>
                                              <td>{book.author}</td>
                                                 <td>{book.price}</td>
                                                    <td>{book.stock}</td>
                                                    <td>
                                                        <button onClick={() => handleDelete(book.id)}>Delete</button>
                                                    </td>
                                    </tr>
                                      ))}</tbody>
                                    </table>
                              
                                    )}
                                    </div>
                                );
                            }
                                export default BookList;