import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const ProtectedRoute = ({ element }) => {
    const { auth } = useAuth(); 

    if (auth.token == null && auth.username == null) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default ProtectedRoute;
