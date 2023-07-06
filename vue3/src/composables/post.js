import {ref} from 'vue'
import ApiService from "@/services/api.service";

export default function handlePost() {
    const loading = ref(false)
    const fetchPosts = (query) => {
        return ApiService.get('/posts', {params: query})
    }

    const storePost = (data) => {
        return ApiService.post('/posts', data)
    }

    return {
        fetchPosts,
        storePost
    }
}
