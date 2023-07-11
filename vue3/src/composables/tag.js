import {ref} from 'vue'
import ApiService from "@/services/api.service";

export default function handleTag() {
    const loading = ref(false)
    const fetchTags = (query) => {
        return ApiService.get('/tags', {params: query})
    }

    const storeTag = (data) => {
        return ApiService.post('/tags', data)
    }

    const updateTag = (id, data) => {
        return ApiService.update(`/tags/${id}`, data)
    }

    const deleteTag = (id) => {
        return ApiService.delete(`/tags/${id}`)
    }

    return {
        fetchTags,
        storeTag,
        updateTag,
        deleteTag
    }
}
