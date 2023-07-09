export default [
    {
        path     : '/login',
        name     : 'LoginPage',
        component: () => import('./Login'),
        meta     : {
            title: 'Login'
        }
    }, {
        path     : '/register',
        name     : 'RegisterPage',
        component: () => import('./Register'),
        meta     : {
            title: 'Register'
        }
    },
];
