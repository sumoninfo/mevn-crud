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
        path: '/author',
        name: 'AdminAuthor',
        component: () => import('./pages/author/Index.vue'),
        meta: {
            title: 'Admin Author'
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
        path: '/tag',
        name: 'AdminTag',
        component: () => import('./pages/tag/Index.vue'),
        meta: {
            title: 'Admin Tag'
        }
    },
    {
        path: '/post',
        name: 'AdminPost',
        component: () => import('./pages/post/Index.vue'),
        meta: {
            title: 'Admin Post'
        }
    },
    {
        path: '/post/create',
        name: 'CreatePost',
        component: () => import('./pages/post/Create.vue'),
        meta: {
            title: 'Create Post'
        }
    },
    {
        path: '/post/:postId/edit',
        name: 'EditPost',
        component: () => import('./pages/post/Create.vue'),
        meta: {
            title: 'Edit Post'
        }
    },
    {
        path: '/post/:postId/show',
        name: 'ShowPost',
        component: () => import('./pages/post/Show.vue'),
        meta: {
            title: 'Show Post'
        }
    }
];

export default AdminRoutes;
