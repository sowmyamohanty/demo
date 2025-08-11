interface MfaChoice {
  id: string;
}

interface MfaChallengeData {
  id: string;                 // MFA form id
  eventStreamId: string;      // MFA event stream id
  mfaType: string;            // e.g. TFA_TEXT, TFA_CHOICE, ...
  prompt: string;
  choiceIds: string[];        // IDs for mfa choices/input
}

interface MfaChallengeFormProps {
  mfaData: MfaChallengeData;
  onMfaSuccess: () => void;
  onMfaError: (errMsg: string) => void;
  onBack: () => void;
}

const MfaChallengeForm: React.FC<MfaChallengeFormProps> = ({
  mfaData,
  onMfaSuccess,
  onMfaError,
  onBack,
}) => {
  const formRef = useRef<HTMLElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const formElement = formRef.current;
    if (!formElement) return;

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');
      // Credentials handled internally by SDK; just wait for success or error events
    };

    const handleDone = (e: CustomEvent) => {
      setSubmitting(false);
      onMfaSuccess();
    };

    const handleError = (e: CustomEvent) => {
      setSubmitting(false);
      const msg = e.detail?.message || 'MFA validation failed.';
      setError(msg);
      onMfaError(msg);
    };

    formElement.addEventListener('submit', handleSubmit);
    formElement.addEventListener('done', handleDone as EventListener);
    formElement.addEventListener('error', handleError as EventListener);

    const submitBtn = formElement.querySelector('#submit-mfa');
    submitBtn?.addEventListener('click', handleSubmit);

    return () => {
      formElement.removeEventListener('submit', handleSubmit);
      formElement.removeEventListener('done', handleDone as EventListener);
      formElement.removeEventListener('error', handleError as EventListener);
      submitBtn?.removeEventListener('click', handleSubmit);
    };
  }, [onMfaSuccess, onMfaError]);

  return (
    <div style={{ maxWidth: 420, margin: 'auto', padding: 24 }}>
      <h2>MFA Challenge</h2>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <mastercard-form
        type="mfaChallenge"
        id={mfaData.id}
        event-stream-id={mfaData.eventStreamId}
        ref={formRef}
        style={{ display: 'block' }}
      >
        <label htmlFor={mfaData.choiceIds[0]} style={{ fontWeight: "600", marginBottom: 6, display: "block" }}>
          {mfaData.prompt}
        </label>

        {mfaData.choiceIds.map(choiceId => (
          <mastercard-mfa-choice
            key={choiceId}
            id={choiceId}
            style={{ display: 'block', marginBottom: 12, width: '100%' }}
          ></mastercard-mfa-choice>
        ))}

        <button
          id="submit-mfa"
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px 0',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 16,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>

        <button onClick={onBack} style={{ marginTop: 10 }}>
          Back
        </button>
      </mastercard-form>
    </div>
  );
};
