import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Mail, Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface ForgotPasswordProps {
    onBackToLogin?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
    const [step, setStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setStep('verify');
            } else {
                setError(data.message || 'Failed to send reset code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('/api/auth/verify-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setStep('reset');
            } else {
                setError(data.message || 'Invalid reset code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    code,
                    newPassword,
                    oldPassword: oldPassword || undefined
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setStep('success');
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        if (onBackToLogin) {
            onBackToLogin();
        } else {
            navigate('/login');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <form onSubmit={handleSendCode} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </form>
                );

            case 'verify':
                return (
                    <form onSubmit={handleVerifyCode} className="space-y-6">
                        <div className="text-center mb-6">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
                            <p className="text-gray-600 mt-2">
                                We've sent a 4-digit code to <strong>{email}</strong>
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Verification Code
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-lg tracking-widest"
                                    placeholder="8888"
                                    maxLength={4}
                                    required
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Enter the code: <strong>8888</strong>
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || code.length !== 4}
                            className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>
                );

            case 'reset':
                return (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div className="text-center mb-6">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">Set New Password</h3>
                            <p className="text-gray-600 mt-2">
                                Code verified! Now set your new password
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password (Optional)
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter current password (optional)"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Provide your current password for additional security
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                );

            case 'success':
                return (
                    <div className="text-center space-y-6">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Password Updated!</h3>
                            <p className="text-gray-600 mt-2">
                                Your password has been successfully updated. You can now login with your new password.
                            </p>
                        </div>
                        <button
                            onClick={handleBackToLogin}
                            className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Palette className="h-12 w-12 text-orange-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        {step === 'email' && 'Reset Password'}
                        {step === 'verify' && 'Verify Code'}
                        {step === 'reset' && 'New Password'}
                        {step === 'success' && 'Success!'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {step === 'email' && 'Enter your email to receive a reset code'}
                        {step === 'verify' && 'Enter the code sent to your email'}
                        {step === 'reset' && 'Set your new password'}
                        {step === 'success' && 'Your password has been updated'}
                    </p>
                </div>

                {renderStep()}

                {step !== 'success' && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleBackToLogin}
                            className="flex items-center justify-center text-orange-600 hover:text-orange-800 text-sm font-medium mx-auto"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Login
                        </button>
                    </div>
                )}

                {message && step !== 'success' && (
                    <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
