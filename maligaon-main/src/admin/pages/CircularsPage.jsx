import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import CircularList from '../components/Circulars/CircularList'
import CircularForm from '../components/Circulars/CircularForm'
import adminApi from '../utils/adminApi'
import { Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'

const CircularsPage = () => {
  const [circulars, setCirculars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetchCirculars()
  }, [])

  const fetchCirculars = async () => {
    try {
      setLoading(true)
      const { data } = await adminApi.get('/circulars')
      setCirculars(data.data || [])
    } catch (error) {
      console.error('Failed to fetch circulars:', error)
      toast.error('Failed to fetch circulars')
      setCirculars([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const form = new FormData()
      
      // Append all fields
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('date', formData.date)
      form.append('time', formData.time)
      form.append('isActive', formData.isActive)
      form.append('order', formData.order)
      
      // Append PDF file if it exists
      if (formData.pdf instanceof File) {
        form.append('pdf', formData.pdf)
      }

      if (editingItem) {
        await adminApi.put(`/circulars/${editingItem._id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Circular updated successfully')
      } else {
        await adminApi.post('/circulars', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Circular added successfully')
      }
      
      fetchCirculars()
      setShowForm(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving circular:', error)
      toast.error(error.response?.data?.message || 'Failed to save circular')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this circular?')) return
    try {
      await adminApi.delete(`/circulars/${id}`)
      toast.success('Circular deleted successfully')
      fetchCirculars()
    } catch (error) {
      console.error('Error deleting circular:', error)
      toast.error('Failed to delete circular')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Circulars</h1>
            <p className="text-gray-500 text-sm mt-1">Manage school notices and circulars</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingItem(null)
            }}
            className="px-4 py-2 bg-maroon-800 text-white rounded-lg hover:bg-maroon-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add Circular
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <CircularForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              initialData={editingItem}
            />
          </div>
        )}

        {/* List Section */}
        <CircularList
          data={circulars}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  )
}

export default CircularsPage
