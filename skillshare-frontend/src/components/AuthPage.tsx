// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import Signin from '../components/auth/Signin';
import Signup from '../components/auth/Signup';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? 'Login to Your Account' : 'Create a New Account'}
                </h2>

                <div className="mb-6 flex justify-center space-x-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`px-4 py-2 rounded ${isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`px-4 py-2 rounded ${!isLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <Signin />
                ) : (
                    <Signup switchToSignin={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
