// AccountLinkingFlow.tsx
import React, { useState, useEffect } from 'react';
import MastercardLoginForm from './MastercardLoginForm';
import MfaChallengeForm from './MfaChallengeForm';
import { LoginFormApiResponse } from './types';
import { fetchMastercardLoginForm } from './api';

export default function AccountLinkingFlow() {
  const [formData, setFormData] = useState<LoginFormApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaData, setMfaData] = useState<any>(null);

  useEffect(() => {
    fetchMastercardLoginForm().then((data) => {
      setFormData(data);
      setLoading(false);
    });
  }, []);

  const handleSuccess = (eventDetail?: any) => {
    alert('🎉 Login successful!');
    console.log('Success event payload:', eventDetail);
  };

  const handleError = (err?: string) => {
    alert(`❌ Login failed: ${err}`);
  };

  const handleCancel = () => {
    alert('⚠️ User cancelled login.');
  };

  const handleMfaChallenge = (mfaEventDetail: any) => {
    console.log('MFA Challenge Data:', mfaEventDetail);
    setMfaData(mfaEventDetail);
  };

  const handleMfaSuccess = () => {
    alert('✅ MFA passed, account linked!');
    setMfaData(null);
  };

  return (
    <>
      {!mfaData && formData && (
        <MastercardLoginForm
          loginFormData={formData}
          loading={loading}
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={handleCancel}
          onMfaRequired={handleMfaChallenge}
        />
      )}

      {mfaData && (
        <MfaChallengeForm
          mfaData={mfaData}
          onMfaSuccess={handleMfaSuccess}
          onMfaError={handleError}
          onBack={() => setMfaData(null)}
        />
      )}
    </>
  );
}
