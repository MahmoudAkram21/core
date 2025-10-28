import { useState } from 'react'
import { categoriesAPI } from '../../api/api'

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Fetch all categories
  const fetchCategories = async (status = null, search = null) => {
    setLoading(true)
    setError(null)
    try {
      const res = await categoriesAPI.getAll(status, search)
      setCategories(res.data.data || res.data)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch categories'
      setError(errorMsg)
      console.error('Fetch categories error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch single category
  const fetchCategory = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const res = await categoriesAPI.getById(id)
      setSelectedCategory(res.data.data || res.data)
      return res.data.data || res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch category'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create category
  const createCategory = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await categoriesAPI.create(formData)
      setCategories([...categories, res.data.data || res.data])
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create category'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update category
  const updateCategory = async (id, formData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await categoriesAPI.update(id, formData)
      setCategories(
        categories.map((cat) =>
          cat.id === id ? res.data.data || res.data : cat
        )
      )
      setSelectedCategory(res.data.data || res.data)
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update category'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete category
  const deleteCategory = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const res = await categoriesAPI.delete(id)
      setCategories(categories.filter((cat) => cat.id !== id))
      return res.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete category'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    selectedCategory,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}