import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function ManageRewards() {
  const [rewards, setRewards] = useState([])
  const [editingReward, setEditingReward] = useState(null)

  const [newReward, setNewReward] = useState({
    name: '',
    cost: '',
    description: '',
    imageUrl: ''
  })

  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    description: ''
  })

  const fetchRewards = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/rewards`)
      setRewards(res.data)
    } catch (err) {
      toast.error('Failed to load rewards')
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/rewards/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Reward deleted')
      fetchRewards()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const handleEdit = (reward) => {
    setEditingReward(reward._id)
    setFormData({
      name: reward.name,
      cost: reward.cost,
      description: reward.description || ''
    })
  }

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${BASE_URL}/rewards/${editingReward}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Reward updated')
      setEditingReward(null)
      fetchRewards()
    } catch (err) {
      toast.error('Update failed')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${BASE_URL}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      setNewReward((prev) => ({ ...prev, imageUrl: res.data.imageUrl }))
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Image upload failed')
    }
  }

  const handleAddReward = async () => {
    if (!newReward.name || !newReward.cost) {
      toast.error('Name and cost are required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${BASE_URL}/rewards`,
        {
          name: newReward.name,
          cost: Number(newReward.cost),
          description: newReward.description,
          imageUrl: newReward.imageUrl
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast.success('Reward added')
      setNewReward({ name: '', cost: '', description: '', imageUrl: '' })
      fetchRewards()
    } catch (err) {
      toast.error('Failed to add reward')
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Manage Rewards</h1>

      {/* Add Reward Section */}
      <div className="bg-gray-50 p-4 mb-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Add New Reward</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
          <Input
            placeholder="Name"
            value={newReward.name}
            onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
          />
          <Input
            placeholder="Cost"
            type="number"
            value={newReward.cost}
            onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newReward.description}
            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
          />
        </div>

        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {newReward.imageUrl && (
          <img src={newReward.imageUrl} alt="Preview" className="w-32 h-32 mt-3 object-cover rounded" />
        )}

        <Button className="mt-3" onClick={handleAddReward}>Add Reward</Button>
      </div>

      {/* Rewards List */}
      {rewards.map((reward) => (
        <div key={reward._id} className="bg-white p-4 mb-4 rounded shadow-md flex justify-between items-center">
          {editingReward === reward._id ? (
            <div className="w-full flex flex-col gap-2">
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Input
                value={formData.cost}
                type="number"
                onChange={(e) => setFormData((prev) => ({ ...prev, cost: Number(e.target.value) }))}
              />
              <Input
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={handleUpdate}>Save</Button>
                <Button variant="secondary" onClick={() => setEditingReward(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                {reward.imageUrl && (
                  <img src={reward.imageUrl} alt={reward.name} className="w-20 h-20 object-cover rounded" />
                )}
                <div>
                  <p className="text-lg font-semibold">{reward.name}</p>
                  <p className="text-sm text-gray-600">Cost: {reward.cost}</p>
                  <p className="text-sm text-gray-500">{reward.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(reward)}>Edit</Button>
                <Button className="text-black" variant="destructive" onClick={() => handleDelete(reward._id)}>Delete</Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}