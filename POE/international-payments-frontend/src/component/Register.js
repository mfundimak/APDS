import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        fullName,
        idNumber,
        accountNumber,
        password
      });
      alert('User registered successfully');
    } catch (err) {
      alert('Error in registration');
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">
                <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                <p className="text-white-50 mb-5">Please fill in the details to register!</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="form-control form-control-lg"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      placeholder="ID Number"
                      className="form-control form-control-lg"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="text"
                      placeholder="Account Number"
                      className="form-control form-control-lg"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-outline-light btn-lg px-5"
                  >
                    Register
                  </button>
                </form>

                <div className="d-flex justify-content-center text-center mt-4 pt-1">
                  <a href="#" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                  <a href="#" className="text-white mx-4 px-2"><i className="fab fa-twitter fa-lg"></i></a>
                  <a href="#" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                </div>

                <p className="mb-0 mt-4">Already have an account? <a href="#" className="text-white-50 fw-bold">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;

