import React, { useState } from 'react';
import axios from 'axios';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/forget-password', { email });
      alert('Password reset link sent to your email!');
    } catch (error) {
      alert('Error sending password reset link: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Forget Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
