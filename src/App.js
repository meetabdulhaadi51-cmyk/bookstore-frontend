import React from 'react';
import './App.css';
import BookList from './components/BookList';
function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: '#282c34', padding: '20px', color: 'white' }}>
        <h1>Welcome to the Bookstore</h1>
      </header>
      <main style={{ padding: '20px' }}>
        <BookList />
      </main>   
    </div>
  );
}

export default App;
