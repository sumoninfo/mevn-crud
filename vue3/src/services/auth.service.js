import router from "@/router";
import * as JwtService from "@/services/jwt.service";
import {nextTick} from "vue";

const AuthCheckService = {
    checkAuth() {
        router.beforeEach((to, from, next) => {
            if (['LoginPage', 'RegisterPage'].includes(to.name) && JwtService.getToken()) {
                next({name: 'AdminDashboard'});
            }

            if (!to.matched.some(record => record.meta.requireAuth)) {
                next();
            }

            if (!JwtService.getToken()) {
                JwtService.destroyToken();
                next({
                    name: 'LoginPage', params: {nextUrl: to.fullPath}
                })
            }

            next();
            nextTick(() => {
                document.title = `${to.meta.title} - ${process.env.VUE_APP_TITLE}` || process.env.VUE_APP_TITLE
            })
        });
    },

};

export default AuthCheckService;
