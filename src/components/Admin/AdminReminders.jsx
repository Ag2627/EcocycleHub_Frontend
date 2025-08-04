import { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle } from 'lucide-react';

const AdminReminders = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/remind');
      setReminders(res.data);
    } catch (err) {
      console.error('Failed to fetch reminders', err);
    }
  };

  const handleResolve = async (reminderId) => {
  try {
    await axios.patch(`http://localhost:5000/remind/${reminderId}/resolve`);
    alert("Reminder resolved and report marked as completed!");

    // Remove the resolved reminder from UI
    setReminders((prev) => prev.filter((r) => r._id !== reminderId));
  } catch (err) {
    console.error("Failed to resolve", err);
    alert("Failed to resolve reminder.");
  }
};


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">⏰ Admin Reminders Panel</h2>

      {reminders.length === 0 ? (
        <p>No reminders yet.</p>
      ) : (
        <div className="space-y-4">
          {reminders.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
            >
              <div>
                <p><strong>User:</strong> {r.userId?.name || r.userId?.email}</p>
                <p><strong>Report:</strong> {r.reportId?.type || 'Unknown'} - {r.reportId?.location}</p>
                <p className="text-sm text-gray-500">
                  <strong>Reminded:</strong> {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                {r.status !== 'resolved' && (
  <button
    onClick={() => handleResolve(r._id)}
    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
  >
    Mark as Resolved
  </button>
)}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReminders;
