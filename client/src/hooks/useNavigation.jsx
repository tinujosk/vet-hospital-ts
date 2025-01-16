import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  const redirectToDashboard = role => {
    switch (role) {
      case 'doctor':
        navigate('/doctor');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'nurse':
        navigate('/nurse');
        break;
      case 'lab':
        navigate('/lab');
        break;
      case 'pharmacist':
        navigate('/pharmacy');
        break;
      default:
        navigate('/');
    }
  };

  return {
    redirectToLogin,
    redirectToDashboard,
  };
};
