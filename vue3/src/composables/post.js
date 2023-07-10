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

    const fetchPost = (id) => {
        return ApiService.get(`/posts/${id}`)
    }

    const updatePost = (id, data) => {
        return ApiService.update(`/posts/${id}`, data)
    }

    const deletePost = (id) => {
        return ApiService.delete(`/posts/${id}`)
    }

    return {
        fetchPosts,
        storePost,
        fetchPost,
        updatePost,
        deletePost
    }
}
