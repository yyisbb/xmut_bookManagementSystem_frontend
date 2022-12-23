import {useLocation, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {store} from "../redux";

/**
 * @description 路由守卫组件
 * */

const AuthRouter = (props) => {
    const {pathname} = useLocation();
    const {token, userInfo} = store.getState().globalSlice;

    // * 判断当前路由是否需要访问权限(不需要权限直接放行)
    if (pathname === '/login'||pathname === '/register') return props.children;

    // * 判断是否有Token
    if (!token && !userInfo) {
        return <Navigate to="/login" replace/>;
    }

    if (pathname==='/dashboard/bookList'&&token&&userInfo.isAdmin){
        return <Navigate to="/dashboard/app" replace/>;
    }

    // * 当前账号有权限返回 Router，正常访问页面
    return props.children;
};
AuthRouter.propTypes = {
    children: PropTypes.object
};
export default AuthRouter;
