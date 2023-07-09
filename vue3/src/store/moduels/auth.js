import ApiService from "@/services/api.service";
const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? user
    : '';
export default {
    namespaced: true,
    // module assets
    state: () => ({
        user: initialState,
        loading_user: true
    }),
    getters: {
        getUserFromGetters(state) {
            return state.user
        },
    },
    actions: {
        getUser(context) {
            ApiService.get('/user').then(response => {
                context.commit("SETUSER", response.data.data);
            }).catch(error => {
                console.log(error, 'error')
            }).finally(() => {
                context.commit("LOADER", false)
            });
        },
        setUser(context, data) {
            context.commit("SETUSER", data);
        }
    },
    mutations: {
        LOADER(state, data) {
            return state.loading_user = data
        },
        SETUSER(state, data) {
            return state.user = data
        }
    },
}
