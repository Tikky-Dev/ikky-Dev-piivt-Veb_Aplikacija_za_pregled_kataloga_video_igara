import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import Menu from '../Menu/Menu';
import ContactPage from '../Pages/ContactPage';
import UserLoginPage from '../User/LoginPage/UserLoginpage';
import './App.sass';
import CategoryList from '../Category/CategoryList/CategoryList';
import CatgoryPage from '../Category/CategoryPage/CategoryPage';
import AdminDashboard from '../Admin/Dashboard/AdminDashboard';
import AdminCategoryList from '../Admin/Dashboard/AdminCategoryList/AdminCategoryList';
import AdminPlatformList from '../Platform/AdminDashboard/AdminPlatformList';
import AdminAdministratorList from '../Admin/Dashboard/AdminList/AdminAdministratorList';
import AdminAdministratorAdd from '../Admin/Dashboard/AdminAdd/AdminAdministratorAdd';
import AdminUserList from '../Admin/Dashboard/AdminUserList/AdminUserList';
import AdminReviewList from '../Admin/Dashboard/AdminReviewList/AdminReviewlist';
import AdminGameList from '../Admin/Dashboard/AdminGameList/AdminGameList';
import AdminCategoryGameList from '../Admin/Dashboard/AdminCategoryGameList/AdminCategoryGameList';
import AdminPlatformGameList from '../Admin/Dashboard/AdminPlatformGameList/AdminPlatformGameList';

function App() {
  return (
    <Container className='mt-4'>
      <Menu/>

        <Routes>
          <Route path='/' element={ <div></div> } />
          <Route path='/contact' element={ <ContactPage /> } />
          <Route path='/categories' element={ <CategoryList /> } />
          <Route path='/auth/user/login' element={ <UserLoginPage /> } />
          <Route path='/admin/dashboard' element={ <AdminDashboard /> } />
          <Route path='/admin/dashboard/categories' element={ <AdminCategoryList/> } />
          <Route path='/admin/dashboard/platform' element={ <AdminPlatformList/> } />
          <Route path='/admin/dashboard/category/:id' element={ <AdminCategoryGameList/> } />
          <Route path='/admin/dashboard/platform/:id' element={ <AdminPlatformGameList/> } />
          <Route path='/admin/dashboard/administrator/list' element={ <AdminAdministratorList/> } />
          <Route path='/admin/dashboard/administrator/add' element={ <AdminAdministratorAdd/> } />
          <Route path='/admin/dashboard/user/list' element={ <AdminUserList/> } />
          <Route path='/admin/dashboard/review/list' element={ <AdminReviewList/> } />
          <Route path='/admin/dashboard/game' element={ <AdminGameList/> } />
          

          <Route path='/categories/:id' element={ <CatgoryPage /> } />
        </Routes>

    </Container>
  );
}

export default App;
