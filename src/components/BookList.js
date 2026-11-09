import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookList() {
    const[books,setBooks]=useState([]);
    const[error,setError]=useState(null);
    const[searchTerm,setSearchTerm]=useState('');

    const[newBook,setNewBook]=useState({
        title: '',
        author: '',
        price: '',
        stock: '',
        imageUrl: ''
    });

    const [editingId, setEditingId] = useState(null);
    const[editFormData,setEditFormData]=useState({
        title: '',
        author: '',
        price: '',
        stock: '',
        imageUrl: ''
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
            setNewBook({ title: '', author: '', price: '', stock: '', imageUrl: '' }); // Clear the form      
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

    const handleEditClick = (book) => {
        setEditingId(book.id);
        setEditFormData({
            title: book.title,
            author: book.author,
            price: book.price,
            stock: book.stock,
            imageUrl: book.imageUrl
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleUpdateBook = (id) => {
    
        axios.put(`http://localhost:8080/api/books/${id}`, editFormData, {
            auth: {
                username: username,
                password: password
            }
        })
        .then(() => {
            fetchBooks();
            setEditingId(null);
        })
        .catch(error => {
            console.error('Error updating book:', error);
            alert('Failed to update book. Please try again.');
        });
    };
    const handleDeleteBook=(id)=>{
        if(window.confirm('Are you sure you want to hide this book?')){
            const updatedBooks=books.filter(book=>book.id!==id);
            setBooks(updatedBooks);
        }
    };
    const handleCancelClick=()=>{setEditingId(null);};
    return (
        <div style={{padding: '20px'}}>
            <h2>Available Books</h2>
            <div style={{marginBottom: '20px'}}>
                <input
                type="text"
                placeholder="search by title or author..."
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                    style={{padding:'10px',width:'300px',borderRadius:'5px',border:'1px solid #ccc'}}/>
                    </div>]            {/* {ADD BOOK FORM} */}
        <div style={{backgroundColor: '#f9f9f9', padding: '20px', marginBottom: '20px', borderRadius: '5px'}}>
            <h3>Add a New Book</h3>
            <form onSubmit={handleAddBook} style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                <input type="text" name="title" placeholder="Title" value={newBook.title} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <input type="text" name="author" placeholder="Author" value={newBook.author} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <input type="number" name="price" placeholder="Price" value={newBook.price} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <input type="number" name="stock" placeholder="Stock" value={newBook.stock} onChange={handleInputChange} required style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px'}} />
                <input type="text" name="imageUrl" placeholder="Image URL ()" value={newBook.imageUrl} onChange={handleInputChange} style={{padding: '10px', border: '1px solid #ccc', borderRadius: '5px',width:'100%'}} />
                <button type="submit">Add Book</button>
            </form>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {books.length===0&&!error?(<p>Loading books...</p>):(
            <table border="1" cellPadding="10" style={{ margin:'0 auto',borderCollapse: 'collapse', width: '100%'}}>
                <thead style={{backgroundColor: '#f2f2f2'}}>
                    <tr>
                        <th>Cover</th>
                    <th>ID</th>
                       <th>Title</th>
                          <th>Author</th>
                             <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {books
                                    .filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(book=>(
                                    <tr key={book.id}>
                                        {editingId===book.id?(<>
              <td>
                <img src={editFormData.imageUrl} alt="cover" style={{width:'50px',height:'75px',objectFit:'cover',borderRadius:'4px'}} />      
                </td>                    
 <td>{book.id}</td>
 <td><input type="text" name="title" value={editFormData.title} onChange={handleEditChange}onKeyDown={(e)=>{if(e.key==='Enter')handleUpdateBook(book.id);}} /></td>
 <td><input type="text" name="author" value={editFormData.author} onChange={handleEditChange} onKeyDown={(e)=>{if(e.key==='Enter')handleUpdateBook(book.id);}}/></td>
 <td><input type="number" name="price" value={editFormData.price} onChange={handleEditChange}onKeyDown={(e)=>{if(e.key==='Enter')handleUpdateBook(book.id);}} /></td>
 <td><input type="number" name="stock" value={editFormData.stock} onChange={handleEditChange} onKeyDown={(e)=>{if(e.key==='Enter')handleUpdateBook(book.id);}} /></td>
 <td><input type="text" name="imageUrl" value={editFormData.imageUrl} onChange={handleEditChange} onKeyDown={(e)=>{if(e.key==='Enter')handleUpdateBook(book.id);}} /></td>
 <td>
     <button onClick={()=>handleUpdateBook(book.id)} style={{backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer'}}>Update</button>
     <button onClick={handleCancelClick} style={{backgroundColor: 'orange', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', marginLeft: '5px'}}>Cancel</button>
     
 </td>
 </>
 ):(
 <>
 <td>
    <img src={book.imageUrl} alt={book.title} style={{width:'50px',height:'75px',objectFit:'cover',borderRadius:'4px'}}/>
 </td>

    <td>{book.id}</td>
    <td>{book.title}</td>
    <td>{book.author}</td>
    <td>₹{book.price}</td>
    <td>{book.stock}</td>
    <td>
<button onClick={()=>handleEditClick(book)} style={{backgroundColor:'blue',color:'white',border:'none',padding:'5px 10px', cursor:'pointer',marginRight:'5px'}}>Edit</button>
<button onClick={()=>handleDeleteBook(book.id)} style={{backgroundColor:'#ffc107',color:'black',border:'none',padding:'5px 10px', cursor:'pointer'}}>hide</button>
<button onClick={()=>handleDelete(book.id)} style={{backgroundColor:'red',color:'white',border:'none',padding:'5px 10px', cursor:'pointer',marginLeft:'5px'}}>Delete</button>
</td>
</>
                                        )}
                                    </tr>
                                      ))}</tbody>
                                    </table>
                              
                                    )}
                                    </div>
                                );
                            }
                                export default BookList;