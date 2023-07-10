import {ref} from 'vue'
import ApiService from "@/services/api.service";

export default function handleAuthor() {
    const loading = ref(false)
    const fetchAuthors = (query) => {
        return ApiService.get('/authors', {params: query})
    }

    const storeAuthor = (data) => {
        return ApiService.post('/authors', data)
    }

    const updateAuthor = (id, data) => {
        return ApiService.update(`/authors/${id}`, data)
    }

    const deleteAuthor = (id) => {
        return ApiService.delete(`/authors/${id}`)
    }

    return {
        fetchAuthors,
        storeAuthor,
        updateAuthor,
        deleteAuthor
    }
}
