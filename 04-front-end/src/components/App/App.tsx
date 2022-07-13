import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Menu from '../Menu/Menu';
import ContactPage from '../Pages/ContactPage';
import UserLoginPage from '../User/LoginPage/UserLoginpage';
import './App.sass';
import CategoryList from '../Category/CategoryList/CategoryList';
import CatgoryPage from '../Category/CategoryPage/CategoryPage';

function App() {
  return (
    <Container className='mt-4'>
      <Menu/>
     
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <div></div> } />
          <Route path='/contact' element={ <ContactPage /> } />
          <Route path='/categories' element={ <CategoryList /> } />
          <Route path='/auth/user/login' element={ <UserLoginPage /> } />

          <Route path='/categories/:id' element={ <CatgoryPage /> } />
        </Routes>
      </BrowserRouter>

    </Container>
  );
}

export default App;
