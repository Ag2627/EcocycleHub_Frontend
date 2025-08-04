import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-gray-800">404</h1>
        <p className="text-xl mt-4 text-gray-600">Oops! The page you're looking for doesn't exist.</p>
        <p className="mt-2 text-gray-500">It might have been removed or you might have typed the wrong URL.</p>
        
        <Link
          to="/user/dashboard"
          className="inline-flex items-center mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
