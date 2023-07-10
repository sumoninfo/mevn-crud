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
    }
];

export default AdminRoutes;
