import { Link } from "react-router-dom";

const UnauthPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default UnauthPage;
