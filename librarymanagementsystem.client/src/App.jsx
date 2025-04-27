import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import BookList from './components/books/BookList';
import Home from './pages/Home';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="books" element={<BookList />} />
            </Route>
        </Routes>
    );
}

export default App;