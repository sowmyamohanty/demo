import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper,
  Autocomplete,
  InputAdornment,
  Fade, // For smoother transitions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security'; // New icon for security message
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Back button icon
import { green, red, blueGrey, grey } from '@mui/material/colors';

// --- Theme Configuration ---
// Defines the Material UI theme for consistent styling and branding.
const theme = createTheme({
  palette: {
    primary: {
      main: '#0056b3', // A deeper, more professional blue
      light: '#4285f4', // Explicitly defined light shade for primary
    },
    secondary: {
      main: grey[700], // Darker grey for secondary text/elements
    },
    success: {
      main: green[600], // Slightly darker green for success
    },
    error: {
      main: red[600], // Slightly darker red for error
    },
    background: {
      default: grey[50], // Light grey background for the whole app
      paper: '#ffffff', // White background for cards/papers
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif', // Using Inter font as specified
    h4: {
      fontWeight: 700, // Bolder headings
      marginBottom: '1.5rem',
      color: grey[900],
    },
    h5: {
      fontWeight: 600,
      marginBottom: '1rem',
      color: grey[800],
    },
    body1: {
      color: grey[700],
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded corners for a softer look
          textTransform: 'none',
          padding: '12px 24px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', // More prominent shadow for buttons
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #007bff 30%, #0056b3 90%)', // Gradient for primary buttons
          color: '#fff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: grey[50], // Light background for input fields
            '&.Mui-focused fieldset': {
              borderColor: '#0056b3', // Primary color border on focus
            },
          },
          '& .MuiInputLabel-root': {
            color: grey[600],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Even more rounded corners for cards
          padding: '32px', // More padding for spacious feel
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)', // Deeper, softer shadow
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    // Removed MuiListItem styleOverrides from here to resolve TypeError
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // No shadow for app bar for a cleaner look
          backgroundColor: '#ffffff', // White app bar
          borderBottom: `1px solid ${grey[200]}`, // Subtle border at the bottom
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'center', // Center content in toolbar
        },
      },
    },
  },
});

// --- Mock API Service ---
interface Institution {
  id: string;
  name: string;
  logoUrl: string;
  supportsOAuth: boolean;
  supportsInstant: boolean;
  supportsMicroDeposit: boolean;
}

const MOCK_INSTITUTIONS: Institution[] = [
  { id: '1', name: 'Bank of America', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=BA', supportsOAuth: true, supportsInstant: true, supportsMicroDeposit: false },
  { id: '2', name: 'Chase', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=CH', supportsOAuth: true, supportsInstant: true, supportsMicroDeposit: false },
  { id: '3', name: 'Wells Fargo', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=WF', supportsOAuth: false, supportsInstant: true, supportsMicroDeposit: true },
  { id: '4', name: 'Citibank', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=CI', supportsOAuth: true, supportsInstant: false, supportsMicroDeposit: true },
  { id: '5', name: 'US Bank', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=US', supportsOAuth: false, supportsInstant: true, supportsMicroDeposit: false },
  { id: '6', name: 'Capital One', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=CO', supportsOAuth: true, supportsInstant: true, supportsMicroDeposit: false },
  { id: '7', name: 'PNC Bank', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=PN', supportsOAuth: false, supportsInstant: true, supportsMicroDeposit: true },
  { id: '8', name: 'TD Bank', logoUrl: 'https://placehold.co/40x40/007bff/ffffff?text=TD', supportsOAuth: true, supportsInstant: false, supportsMicroDeposit: true },
];

const api = {
  getInstitutions: async (): Promise<Institution[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_INSTITUTIONS), 500);
    });
  },
  searchInstitutions: async (query: string): Promise<Institution[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_INSTITUTIONS.filter(inst =>
          inst.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  },
  linkInstant: async (institutionId: string, username: string, password: string): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === 'user' && password === 'pass') {
          resolve({ success: true, message: 'Account linked successfully via Instant Linking!' });
        } else {
          resolve({ success: false, message: 'Invalid credentials. Please try again.' });
        }
      }, 1500);
    });
  },
  verifyMicroDeposits: async (institutionId: string, amount1: number, amount2: number): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (amount1 === 0.10 && amount2 === 0.15) {
          resolve({ success: true, message: 'Micro-deposits verified successfully!' });
        } else {
          resolve({ success: false, message: 'Incorrect micro-deposit amounts. Please check your bank statement.' });
        }
      }, 2000);
    });
  },
};

// --- Context for Global State Management ---
interface AppContextType {
  selectedInstitution: Institution | null;
  setSelectedInstitution: React.Dispatch<React.SetStateAction<Institution | null>>;
  currentStep: AppStep;
  setCurrentStep: React.Dispatch<React.SetStateAction<AppStep>>;
  setSnackBarMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSnackBarSeverity: React.Dispatch<React.SetStateAction<'success' | 'error' | 'info' | 'warning'>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// --- Enums and Types ---
enum AppStep {
  INSTITUTION_SEARCH = 'institution_search',
  LINKING_METHOD_SELECTION = 'linking_method_selection',
  OAUTH_FLOW = 'oauth_flow',
  INSTANT_LINKING = 'instant_linking',
  MICRO_DEPOSIT_VERIFICATION = 'micro_deposit_verification',
  SUCCESS = 'success',
  ERROR = 'error',
}

// --- Institution Search Component ---
const InstitutionSearch: React.FC = () => {
  const { setSelectedInstitution, setCurrentStep, setSnackBarMessage, setSnackBarSeverity } = useAppContext();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const data = await api.getInstitutions();
        setInstitutions(data);
        setFilteredInstitutions(data);
      } catch (err) {
        setSnackBarMessage('Failed to load institutions.');
        setSnackBarSeverity('error');
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutions();
  }, [setSnackBarMessage, setSnackBarSeverity]);

  useEffect(() => {
    if (searchTerm) {
      const results = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInstitutions(results);
    } else {
      setFilteredInstitutions(institutions);
    }
  }, [searchTerm, institutions]);

  const handleSelectInstitution = (institution: Institution | null) => {
    if (institution) {
      setSelectedInstitution(institution);
      if (institution.supportsOAuth || institution.supportsInstant || institution.supportsMicroDeposit) {
        setCurrentStep(AppStep.LINKING_METHOD_SELECTION);
      } else {
        setSnackBarMessage('Selected institution does not support any linking methods.');
        setSnackBarSeverity('warning');
      }
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, maxWidth: 650, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Connect Your Bank Account
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Search for your financial institution to securely link your account.
        </Typography>

        <Autocomplete
          options={filteredInstitutions}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => handleSelectInstitution(newValue)}
          onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for your bank or credit union"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <ListItem {...props} key={option.id} component="li"> {/* Ensure component is 'li' for Autocomplete */}
              <ListItemIcon>
                <Avatar src={option.logoUrl} alt={option.name} sx={{ width: 32, height: 32 }} />
              </ListItemIcon>
              <ListItemText primary={option.name} />
            </ListItem>
          )}
          sx={{ mb: 4 }}
        />

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {!loading && filteredInstitutions.length === 0 && searchTerm && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            No institutions found matching "{searchTerm}". Please try a different search term.
          </Typography>
        )}

        {!loading && !searchTerm && institutions.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom sx={{ color: grey[800] }}>
              Popular Institutions
            </Typography>
            <List>
              {institutions.slice(0, 5).map((inst) => (
                <ListItem
                  key={inst.id}
                  component="button" // Render as a button for clickability and accessibility
                  onClick={() => handleSelectInstitution(inst)}
                  sx={(theme) => ({ // Use theme here
                    borderRadius: 2,
                    mb: 1,
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    border: `1px solid ${grey[200]}`,
                    boxShadow: '0px 2px 5px rgba(0,0,0,0.03)',
                    '&:hover': {
                      backgroundColor: grey[50],
                      borderColor: theme.palette.primary.light, // Apply border color here
                    },
                  })}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={inst.logoUrl} alt={inst.name} sx={{ mr: 2, width: 40, height: 40 }} />
                    <ListItemText primary={inst.name} primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }} />
                  </Box>
                  <ArrowBackIcon sx={{ transform: 'rotate(180deg)', color: grey[400] }} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: grey[600] }}>
          <SecurityIcon fontSize="small" sx={{ mr: 1, color: green[500] }} />
          <Typography variant="caption">
            Your data is securely encrypted.
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

// --- Linking Method Selection Component ---
const LinkingMethodSelection: React.FC = () => {
  const { selectedInstitution, setCurrentStep } = useAppContext();

  if (!selectedInstitution) {
    setCurrentStep(AppStep.INSTITUTION_SEARCH);
    return null;
  }

  const handleBackClick = () => {
    setCurrentStep(AppStep.INSTITUTION_SEARCH);
  };

  const handleOAuthClick = () => {
    setCurrentStep(AppStep.OAUTH_FLOW);
  };

  const handleInstantClick = () => {
    setCurrentStep(AppStep.INSTANT_LINKING);
  };

  const handleMicroDepositClick = () => {
    setCurrentStep(AppStep.MICRO_DEPOSIT_VERIFICATION);
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, maxWidth: 650, mx: 'auto', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            onClick={handleBackClick}
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="secondary"
            sx={{ mr: 'auto', textTransform: 'none' }}
          >
            Back
          </Button>
          <Avatar src={selectedInstitution.logoUrl} alt={selectedInstitution.name} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Link with {selectedInstitution.name}
          </Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Choose the most convenient way to connect your account.
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {selectedInstitution.supportsOAuth && (
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                onClick={handleOAuthClick}
              >
                <AccountBalanceIcon sx={{ fontSize: 45, mb: 1, color: 'white' }} />
                <Typography variant="button" sx={{ color: 'white' }}>Connect with OAuth</Typography>
                <Typography variant="caption" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.8)' }}>Securely redirect to bank</Typography>
              </Button>
            </Box>
          )}
          {selectedInstitution.supportsInstant && (
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                onClick={handleInstantClick}
              >
                <LockIcon sx={{ fontSize: 45, mb: 1, color: 'white' }} />
                <Typography variant="button" sx={{ color: 'white' }}>Instant Linking</Typography>
                <Typography variant="caption" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.8)' }}>Enter your online banking credentials</Typography>
              </Button>
            </Box>
          )}
          {selectedInstitution.supportsMicroDeposit && (
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                onClick={handleMicroDepositClick}
              >
                <CreditCardIcon sx={{ fontSize: 45, mb: 1, color: 'white' }} />
                <Typography variant="button" sx={{ color: 'white' }}>Micro-Deposit Verification</Typography>
                <Typography variant="caption" sx={{ mt: 0.5, color: 'rgba(255,255,255,0.8)' }}>Verify small deposits</Typography>
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Fade>
  );
};

// --- OAuth Flow Component ---
const OAuthFlow: React.FC = () => {
  const { selectedInstitution, setCurrentStep, setSnackBarMessage, setSnackBarSeverity } = useAppContext();

  useEffect(() => {
    const simulateOAuth = setTimeout(() => {
      setSnackBarMessage(`Redirecting to ${selectedInstitution?.name} for OAuth... (simulated success)`);
      setSnackBarSeverity('info');
      setCurrentStep(AppStep.SUCCESS);
    }, 3000);

    return () => clearTimeout(simulateOAuth);
  }, [selectedInstitution, setCurrentStep, setSnackBarMessage, setSnackBarSeverity]);

  const handleBackClick = () => {
    setCurrentStep(AppStep.LINKING_METHOD_SELECTION);
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, maxWidth: 650, mx: 'auto', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            onClick={handleBackClick}
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="secondary"
            sx={{ mr: 'auto', textTransform: 'none' }}
          >
            Back
          </Button>
          <Avatar src={selectedInstitution?.logoUrl} alt={selectedInstitution?.name} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Connecting with {selectedInstitution?.name}
          </Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          You will be securely redirected to {selectedInstitution?.name}'s website to authorize access.
        </Typography>
        <CircularProgress size={60} sx={{ mb: 4, color: theme.palette.primary.main }} />
        <Typography variant="body2" color="textSecondary">
          Please wait while we redirect you...
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: grey[600] }}>
          <SecurityIcon fontSize="small" sx={{ mr: 1, color: green[500] }} />
          <Typography variant="caption">
            This is a secure connection.
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

// --- Instant Linking Form Component ---
const InstantLinkingForm: React.FC = () => {
  const { selectedInstitution, setCurrentStep, setSnackBarMessage, setSnackBarSeverity } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    if (!selectedInstitution) {
      setError("No institution selected.");
      setLoading(false);
      return;
    }

    try {
      const result = await api.linkInstant(selectedInstitution.id, username, password);
      if (result.success) {
        setSnackBarMessage(result.message);
        setSnackBarSeverity('success');
        setCurrentStep(AppStep.SUCCESS);
      } else {
        setError(result.message);
        setSnackBarMessage(result.message);
        setSnackBarSeverity('error');
      }
    } catch (err) {
      setError('An unexpected error occurred during linking.');
      setSnackBarMessage('An unexpected error occurred.');
      setSnackBarSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setCurrentStep(AppStep.LINKING_METHOD_SELECTION);
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, maxWidth: 650, mx: 'auto', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            onClick={handleBackClick}
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="secondary"
            sx={{ mr: 'auto', textTransform: 'none' }}
          >
            Back
          </Button>
          <Avatar src={selectedInstitution?.logoUrl} alt={selectedInstitution?.name} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Instant Link with {selectedInstitution?.name}
          </Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Enter your online banking credentials. Your information is encrypted and never stored.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            aria-label="Online banking username"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            aria-label="Online banking password"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Connecting...' : 'Connect Account'}
          </Button>
        </form>
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: grey[600] }}>
          <SecurityIcon fontSize="small" sx={{ mr: 1, color: green[500] }} />
          <Typography variant="caption">
            Your credentials are securely transmitted and never stored by us.
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

// --- Micro-Deposit Verification Form Component ---
const MicroDepositForm: React.FC = () => {
  const { selectedInstitution, setCurrentStep, setSnackBarMessage, setSnackBarSeverity } = useAppContext();
  const [amount1, setAmount1] = useState<string>('');
  const [amount2, setAmount2] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    if (!selectedInstitution) {
      setError("No institution selected.");
      setLoading(false);
      return;
    }

    const numAmount1 = parseFloat(amount1);
    const numAmount2 = parseFloat(amount2);

    if (isNaN(numAmount1) || isNaN(numAmount2) || numAmount1 <= 0 || numAmount2 <= 0) {
      setError("Please enter valid positive amounts for both deposits.");
      setLoading(false);
      return;
    }

    try {
      const result = await api.verifyMicroDeposits(selectedInstitution.id, numAmount1, numAmount2);
      if (result.success) {
        setSnackBarMessage(result.message);
        setSnackBarSeverity('success');
        setCurrentStep(AppStep.SUCCESS);
      } else {
        setError(result.message);
        setSnackBarMessage(result.message);
        setSnackBarSeverity('error');
      }
    } catch (err) {
      setError('An unexpected error occurred during verification.');
      setSnackBarMessage('An unexpected error occurred.');
      setSnackBarSeverity('error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setCurrentStep(AppStep.LINKING_METHOD_SELECTION);
  };

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, maxWidth: 650, mx: 'auto', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            onClick={handleBackClick}
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="secondary"
            sx={{ mr: 'auto', textTransform: 'none' }}
          >
            Back
          </Button>
          <Avatar src={selectedInstitution?.logoUrl} alt={selectedInstitution?.name} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'left' }}>
            Verify Micro-Deposits for {selectedInstitution?.name}
          </Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          We've sent two small deposits to your account. Please enter the exact amounts below to verify.
          This may take 1-2 business days to appear in your bank statement.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="First Deposit Amount"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ step: "0.01" }}
            value={amount1}
            onChange={(e) => setAmount1(e.target.value)}
            required
            disabled={loading}
            aria-label="First micro-deposit amount"
          />
          <TextField
            label="Second Deposit Amount"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ step: "0.01" }}
            value={amount2}
            onChange={(e) => setAmount2(e.target.value)}
            required
            disabled={loading}
            aria-label="Second micro-deposit amount"
          />
          {error && (
            <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Verifying...' : 'Verify Deposits'}
          </Button>
        </form>
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: grey[600] }}>
          <SecurityIcon fontSize="small" sx={{ mr: 1, color: green[500] }} />
          <Typography variant="caption">
            Your account information is securely handled.
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

// --- Success Screen Component ---
const SuccessScreen: React.FC = () => {
  const { selectedInstitution, setCurrentStep } = useAppContext();

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, maxWidth: 650, mx: 'auto', textAlign: 'center' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 90, color: 'success.main', mb: 3 }} />
        <Typography variant="h4" gutterBottom color="success.main">
          Account Linked!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Your account with {selectedInstitution?.name || 'your institution'} has been successfully linked.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          You can now proceed with your application. Thank you for connecting!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            setCurrentStep(AppStep.INSTITUTION_SEARCH);
            // window.parent.postMessage({ type: 'ACCOUNT_LINKED', institutionId: selectedInstitution?.id }, '*');
          }}
        >
          Link Another Account
        </Button>
      </Paper>
    </Fade>
  );
};

// --- Error Screen Component ---
const ErrorScreen: React.FC = () => {
  const { setCurrentStep } = useAppContext();

  return (
    <Fade in={true} timeout={500}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, maxWidth: 650, mx: 'auto', textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 90, color: 'error.main', mb: 3 }} />
        <Typography variant="h4" gutterBottom color="error.main">
          Connection Failed
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          We encountered an issue while trying to link your account. Please check your details and try again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setCurrentStep(AppStep.INSTITUTION_SEARCH)}
        >
          Try Again
        </Button>
      </Paper>
    </Fade>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INSTITUTION_SEARCH);
  const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
  const [snackBarSeverity, setSnackBarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarMessage(null);
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case AppStep.INSTITUTION_SEARCH:
        return <InstitutionSearch />;
      case AppStep.LINKING_METHOD_SELECTION:
        return <LinkingMethodSelection />;
      case AppStep.OAUTH_FLOW:
        return <OAuthFlow />;
      case AppStep.INSTANT_LINKING:
        return <InstantLinkingForm />;
      case AppStep.MICRO_DEPOSIT_VERIFICATION:
        return <MicroDepositForm />;
      case AppStep.SUCCESS:
        return <SuccessScreen />;
      case AppStep.ERROR:
        return <ErrorScreen />;
      default:
        return <InstitutionSearch />;
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedInstitution,
        setSelectedInstitution,
        currentStep,
        setCurrentStep,
        setSnackBarMessage,
        setSnackBarSeverity,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" elevation={0} sx={{ py: 1.5 }}> {/* Removed shadow, added padding */}
          <Toolbar sx={{ justifyContent: 'center' }}>
            <Typography variant="h6" component="div" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              Account Link
            </Typography>
            {selectedInstitution && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                <Avatar src={selectedInstitution.logoUrl} alt={selectedInstitution.name} sx={{ mr: 1, width: 32, height: 32 }} />
                <Typography variant="subtitle1" sx={{ color: grey[700], fontWeight: 500 }}>
                  {selectedInstitution.name}
                </Typography>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {renderStepComponent()}
        </Container>

        <Snackbar
          open={!!snackBarMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackBarSeverity} sx={{ width: '100%', boxShadow: '0px 4px 15px rgba(0,0,0,0.1)' }}>
            {snackBarMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
