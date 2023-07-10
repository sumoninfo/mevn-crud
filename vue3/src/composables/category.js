import {ref} from 'vue'
import ApiService from "@/services/api.service";

export default function handleCategory() {
    const loading = ref(false)
    const fetchCategories = (query) => {
        return ApiService.get('/categories', {params: query})
    }

    const storeCategory = (data) => {
        return ApiService.post('/categories', data)
    }

    const updateCategory = (id, data) => {
        return ApiService.update(`/categories/${id}`, data)
    }

    const deleteCategory = (id) => {
        return ApiService.delete(`/categories/${id}`)
    }

    return {
        fetchCategories,
        storeCategory,
        updateCategory,
        deleteCategory
    }
}
