// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{width: 1, height: 1}}/>;

export const authNavConfig = [
    {
        title: '主页管理',
        path: '/dashboard/app',
        icon: icon('ic_analytics'),
    },
    {
        title: '学生管理',
        path: '/dashboard/user',
        icon: icon('ic_user'),
    },
    {
        title: '分类管理',
        path: '/dashboard/category',
        icon: icon('ic_lock'),
    },
    {
        title: '图书列表管理',
        path: '/dashboard/bookManagement',
        icon: icon('ic_blog'),
    },
    {
        title: '操作日志',
        path: '/dashboard/logList',
        icon: icon('ic_cart'),
    },
    {
        title: '站内通知',
        path: '/dashboard/noticeList',
        icon: icon('ic_cart'),
    },
];

export const navConfig = [
    {
        title: '图书列表',
        path: '/dashboard/bookList',
        icon: icon('ic_cart'),
    },
    {
        title: '借阅记录',
        path: '/dashboard/borrowList',
        icon: icon('ic_cart'),
    },
];
