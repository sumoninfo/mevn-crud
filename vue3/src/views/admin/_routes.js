const AdminRoutes = [
    {
        path: '/dashboard',
        name: 'AdminDashboard',
        component: () => import('./pages/Dashboard'),
        meta: {
            title: 'Admin Dashboard'
        }
    },
    {
        path: '/category',
        name: 'AdminCategory',
        component: () => import('./pages/category/Index.vue'),
        meta: {
            title: 'Admin Category'
        }
    },
    {
        path: '/post',
        name: 'AdminPost',
        component: () => import('./pages/post/Index.vue'),
        meta: {
            title: 'Admin Post'
        }
    }
];

export default AdminRoutes;
