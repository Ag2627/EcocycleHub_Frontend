'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, Loader , Leaf} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import { fetchRewardsData, redeemReward } from '../../../redux/store/rewardSlice'

export default function RewardsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, balance, rewards, loading, error } = useSelector(state => state.rewards)

  // Load user rewards on mount
  useEffect(() => {
  const userId = localStorage.getItem('id')
  if (userId) {
    dispatch(fetchRewardsData(userId))
  } else {
    toast.error('User not logged in.')
  }
}, [dispatch])


  const handleRedeem = (rewardId) => {
  const userId = localStorage.getItem('id') // ✅ Use stored user ID

  if (!userId) return toast.error('Please log in.')

  const reward = rewards.find(r => r._id === rewardId)
  if (!reward || reward.cost <= 0 || balance < reward.cost) {
    return toast.error('Insufficient points or invalid reward.')
  }

  dispatch(redeemReward({ userId, rewardId }))
    .unwrap()
    .then(() => toast.success(`Redeemed ${reward.name}`))
    .catch(err => toast.error(err))
}


  const goToTransactionPage = () => {
    navigate('/user/transactions')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 mt-6">{error}</div>
  }

  return (
    <div>
      <div className="pt-4 px-10">
        <Link to="/user/dashboard" className="flex items-center text-green-800 font-bold text-xl">
          <Leaf size={28} className="mr-2" />
          RecycleConnect
        </Link>
      </div>
    <div className="p-8 max-w-4xl mx-auto">
      
    <h1 className="text-3xl font-semibold text-gray-800">Rewards Dashboard</h1>
 

      {/* Points & View Transactions Button */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Coins className="w-10 h-10 mr-3 text-green-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Available Points</h2>
            <span className="text-3xl font-bold text-green-600">{balance}</span>
          </div>
        </div>
        <Button onClick={goToTransactionPage} className="text-sm bg-gray-100 text-green-600 hover:bg-green-100">
          View Transactions
        </Button>
      </div>

      {/* Rewards */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Available Rewards</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {rewards.length > 0 ? (
            rewards.map(reward => (
              <div key={reward._id} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="text-gray-800 font-medium">{reward.name}</p>
                  <p className="text-sm text-gray-500">Cost: {reward.cost} pts</p>
                </div>
                <Button onClick={() => handleRedeem(reward._id)} disabled={balance < reward.cost}>
                  Redeem
                </Button>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No rewards available</div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}




