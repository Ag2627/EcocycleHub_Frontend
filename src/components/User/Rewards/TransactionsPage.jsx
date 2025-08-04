'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRewardsData } from '../../../redux/store/rewardSlice'
import { Loader , Leaf} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function TransactionsPage() {
  const dispatch = useDispatch()
  const {
    user,
    transactions,
    loading,
    error
  } = useSelector(state => state.rewards)

  
  // Fetch transactions and user data
  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    
    if (email) {
      dispatch(fetchRewardsData(email))
    } else {
      toast.error('User not logged in.')
    }
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>
  }

  return (
    <div>
     <div className="pt-4 px-10">
        <Link to="/user/dashboard" className="flex items-center text-green-800 font-bold text-xl">
          <Leaf size={28} className="mr-2" />
          RecycleConnect
        </Link>
      </div>

    <div className="p-8 max-w-3xl mx-auto">
    
    <h1 className="text-3xl font-semibold text-gray-800">Transaction History</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {transactions.length > 0 ? (
          transactions.map(txn => (
            <div
              key={txn._id}
              className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
            >
              <div>
                <p className="text-gray-800 font-medium">{txn.description}</p>
                <p className="text-sm text-gray-500">{new Date(txn.createdAt).toLocaleString()}</p>
              </div>
              <span
                className={`text-lg font-semibold ${
                  txn.type === 'earned' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {txn.type === 'earned' ? '+' : '-'}
                {txn.amount}
              </span>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No transactions yet</div>
        )}
      </div>
    </div>
    </div>
  )
}
