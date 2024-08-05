import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import ResetPasswordPage from './pages/ResetPassword';
import ForgetPasswordPage from './pages/ForgetPassword';
import { Provider } from 'react-redux';
import store from './redux/store'; // Redux store configuration

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset/:token" element={<ResetPasswordPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
