import {Navigate, useRoutes} from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import SimpleLayout from '../layouts/simple';
//
import UserPage from '../pages/UserPage';
import LoginPage from '../pages/LoginPage';
import Page404 from '../pages/Page404';
import BookListage from '../pages/BooksPage';
import CategoryPage from '../pages/CategoryPage';
import DashboardAppPage from '../pages/DashboardAppPage';
import BookManagementPage from "../pages/BookManagementPage";
import AddBookPage from "../pages/AddBookPage";
import BorrowPage from "../pages/BorrowPage";
import RegisterPage from "../pages/RegisterPage";
import BookConetentPage from "../pages/BookConetentPage";
import LogPage from "../pages/LogPage";
import NoticePage from "../pages/NoticeList";
import AddNoticePage from "../pages/AddNoticePage";

// ----------------------------------------------------------------------


export default function Router() {

    const routes = useRoutes([
        {
            path: '/',
            element: <Navigate to="/dashboard/bookList"/>
        },
        {
            path: '/dashboard',
            element: <DashboardLayout/>,
            children: [
                {element: <Navigate to="/dashboard/app"/>, index: true},
                {path: 'bookList', element: <BookListage/>},
                {path: 'app', element: <DashboardAppPage/>},
                {path: 'user', element: <UserPage/>},
                {path: 'category', element: <CategoryPage/>},
                {path: 'bookManagement', element: <BookManagementPage/>},
                {path: 'addBook', element: <AddBookPage/>},
                {path: 'borrowList', element: <BorrowPage/>},
                {path: 'logList', element: <LogPage/>},
                {path: 'noticeList', element: <NoticePage/>},
                {path: 'addNotice', element: <AddNoticePage/>},
            ],
        },
        {path: 'book/:id', element: <BookConetentPage/>},
        {
            path: 'login',
            element: <LoginPage/>,
        },
        {
            path: 'register',
            element: <RegisterPage/>,
        },
        {
            element: <SimpleLayout/>,
            children: [
                {element: <Navigate to="/dashboard/bookList"/>, index: true},
                {path: '404', element: <Page404/>},
                {path: '*', element: <Navigate to="/404"/>},
            ],
        },
        {
            path: '*',
            element: <Navigate to="/404" replace/>,
        },
    ]);

    return routes;
}
