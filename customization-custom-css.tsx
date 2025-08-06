import React, { useState, useEffect } from 'react';
import {
  Palette,
  Type,
  ImageIcon,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  Save,
  RefreshCcw,
  Globe,
  Database,
  Banknote, // New icon for Microdeposit/Verification
  Layout, // New icon for Layout/Branding details
} from 'lucide-react'; // Using lucide-react for icons
import './Customization.css'; // Import custom CSS

// Shadcn/ui components (simulated for demonstration)
// In a real shadcn/ui setup, these would be imported from '@shadcn/ui/components'
const Card = ({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`card ${className || ''}`} style={style}>
    {children}
  </div>
);
const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`card-header ${className || ''}`}>{children}</div>
);
const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`card-title ${className || ''}`}>{children}</h3>
);
const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={`card-description ${className || ''}`}>{children}</p>
);
const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`card-content ${className || ''}`}>{children}</div>
);
const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`card-footer ${className || ''}`}>{children}</div>
);

const Label = ({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
  <label htmlFor={htmlFor} className={`form-label ${className || ''}`}>
    {children}
  </label>
);

const Input = ({ type = 'text', id, value, onChange, placeholder, className, ...props }: { type?: string; id?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; className?: string; [key: string]: any }) => (
  <input
    type={type}
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`form-input ${className || ''}`}
    {...props}
  />
);

const Textarea = ({ id, value, onChange, placeholder, className, ...props }: { id?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; className?: string; [key: string]: any }) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`form-textarea ${className || ''}`}
    {...props}
  />
);

const Button = ({ children, onClick, variant = 'default', size = 'default', className, ...props }: { children: React.ReactNode; onClick?: () => void; variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'; size?: 'default' | 'sm' | 'lg' | 'icon'; className?: string; [key: string]: any }) => {
  const getButtonClasses = () => {
    let classes = 'btn';
    
    switch (variant) {
      case 'outline':
        classes += ' btn-outline';
        break;
      case 'destructive':
        classes += ' btn-destructive';
        break;
      case 'secondary':
        classes += ' btn-secondary';
        break;
      case 'ghost':
        classes += ' btn-ghost';
        break;
      case 'link':
        classes += ' btn-link';
        break;
      default:
        classes += ' btn-primary';
    }
    
    switch (size) {
      case 'sm':
        classes += ' btn-sm';
        break;
      case 'lg':
        classes += ' btn-lg';
        break;
      case 'icon':
        classes += ' btn-icon';
        break;
    }
    
    return classes;
  };

  return (
    <button
      onClick={onClick}
      className={`${getButtonClasses()} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Select = ({ children, value, onValueChange, className, ...props }: { children: React.ReactNode; value?: string; onValueChange?: (value: string) => void; className?: string; [key: string]: any }) => (
  <select
    value={value}
    onChange={(e) => onValueChange && onValueChange(e.target.value)}
    className={`form-select ${className || ''}`}
    {...props}
  >
    {children}
  </select>
);

const Switch = ({ checked, onCheckedChange, id, className }: { checked?: boolean; onCheckedChange?: (checked: boolean) => void; id?: string; className?: string }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange && onCheckedChange(!checked)}
    id={id}
    className={`switch ${checked ? 'data-[state=checked]:bg-primary' : 'data-[state=unchecked]:bg-input'} ${className || ''}`}
    data-state={checked ? 'checked' : 'unchecked'}
  >
    <span
      data-state={checked ? 'checked' : 'unchecked'}
      className={`switch-thumb ${checked ? 'data-[state=checked]:translate-x-5' : 'data-[state=unchecked]:translate-x-0'}`}
    />
  </button>
);

const Tabs = ({ children, defaultValue, className }: { children: React.ReactNode; defaultValue: string; className?: string }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={className}>
      <div className="tabs-list">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as any).displayName === 'TabsTrigger') {
            return React.cloneElement(child as React.ReactElement<any>, {
              isActive: (child.props as any).value === activeTab,
              onClick: () => setActiveTab((child.props as any).value),
            });
          }
          return null;
        })}
      </div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any).displayName === 'TabsContent' && (child.props as any).value === activeTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

const TabsTrigger = ({ children, value, isActive, onClick }: { children: React.ReactNode; value: string; isActive?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`tabs-trigger ${isActive ? 'active' : ''}`}
  >
    {children}
  </button>
);
(TabsTrigger as any).displayName = 'TabsTrigger';

const TabsContent = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <div className="tabs-content">
    {children}
  </div>
);
(TabsContent as any).displayName = 'TabsContent';

// Main App Component
const Customization: React.FC = () => {
  const [config, setConfig] = useState({
    primaryColor: '#4F46E5', // Indigo-600
    secondaryColor: '#6366F1', // Indigo-500
    buttonTextColor: '#FFFFFF',
    fontFamily: 'Inter',
    logoUrl: 'https://placehold.co/150x50/4F46E5/FFFFFF?text=Your+Logo',
    backgroundColor: '#F3F4F6', // Gray-100
    cardBackgroundColor: '#FFFFFF', // New: Background for inner Connect card
    buttonShape: 'rounded' as 'rounded' | 'square' | 'pill',
    borderRadius: '0.5rem', // New: for general elements
    shadowsEnabled: true, // New: Enable/disable shadows
    headerText: 'Connect Your Bank Account', // New
    footerText: 'Powered by Finicity, a Mastercard Company', // New
    welcomeMessage: 'Connect your financial accounts securely.',
    institutionSearchPlaceholder: 'Search for your bank or credit union...',
    mfaPromptText: 'Please enter the code sent to your device.',
    accountSelectionInstruction: 'Select the accounts you wish to connect.',
    successMessage: 'Connection successful!',
    errorMessage: 'Failed to connect. Please try again.',
    enableMFA: true,
    enableAccountSelection: true,
    flowType: 'aggregator' as 'aggregator' | 'pay-by-bank' | 'verification',
    allowedAccountTypes: ['checking', 'savings', 'credit'],
    displayInstitutionLogos: true,
    hideUnsupportedInstitutions: false,
    enableTransactionHistory: true,
    enableStatementAccess: false,
    defaultLanguage: 'en-US',
    verificationMethod: 'instant' as 'instant' | 'microdeposit', // New
    microdepositInstructions: 'Two small deposits will be sent to your account within 1-2 business days. Please return here to verify the amounts.', // New
    microdepositAmountPlaceholder: 'Enter the two microdeposit amounts (e.g., 0.12, 0.34)', // New
  });

  useEffect(() => {
    // Apply font to body for global preview
    document.body.style.fontFamily = config.fontFamily;
  }, [config.fontFamily]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (id: string, value: string) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [id]: value,
    }));
  };

  const handleToggleChange = (id: string, checked: boolean) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [id]: checked,
    }));
  };

  const handleMultiSelectChange = (id: string, value: string, isChecked: boolean) => {
    setConfig((prevConfig) => {
      const currentValues = (prevConfig as any)[id] as string[];
      if (isChecked) {
        return { ...prevConfig, [id]: [...currentValues, value] };
      } else {
        return { ...prevConfig, [id]: currentValues.filter((item) => item !== value) };
      }
    });
  };

  const resetConfig = () => {
    setConfig({
      primaryColor: '#4F46E5',
      secondaryColor: '#6366F1',
      buttonTextColor: '#FFFFFF',
      fontFamily: 'Inter',
      logoUrl: 'https://placehold.co/150x50/4F46E5/FFFFFF?text=Your+Logo',
      backgroundColor: '#F3F4F6',
      cardBackgroundColor: '#FFFFFF',
      buttonShape: 'rounded',
      borderRadius: '0.5rem',
      shadowsEnabled: true,
      headerText: 'Connect Your Bank Account',
      footerText: 'Powered by Finicity, a Mastercard Company',
      welcomeMessage: 'Connect your financial accounts securely.',
      institutionSearchPlaceholder: 'Search for your bank or credit union...',
      mfaPromptText: 'Please enter the code sent to your device.',
      accountSelectionInstruction: 'Select the accounts you wish to connect.',
      successMessage: 'Connection successful!',
      errorMessage: 'Failed to connect. Please try again.',
      enableMFA: true,
      enableAccountSelection: true,
      flowType: 'aggregator',
      allowedAccountTypes: ['checking', 'savings', 'credit'],
      displayInstitutionLogos: true,
      hideUnsupportedInstitutions: false,
      enableTransactionHistory: true,
      enableStatementAccess: false,
      defaultLanguage: 'en-US',
      verificationMethod: 'instant',
      microdepositInstructions: 'Two small deposits will be sent to your account within 1-2 business days. Please return here to verify the amounts.',
      microdepositAmountPlaceholder: 'Enter the two microdeposit amounts (e.g., 0.12, 0.34)',
    });
  };

  const saveConfig = () => {
    // In a real application, this would send the config to a backend API
    console.log('Saving configuration:', config);
    alert('Configuration saved successfully! (Check console for details)');
  };

  const getButtonClass = () => {
    switch (config.buttonShape) {
      case 'square':
        return 'rounded-none';
      case 'pill':
        return 'rounded-full';
      case 'rounded':
      default:
        return 'rounded-md';
    }
  };

  const getCardShadowClass = () => {
    return config.shadowsEnabled ? 'shadow-xl' : 'shadow-none';
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4" style={{ fontFamily: config.fontFamily, backgroundColor: config.backgroundColor }}>
      <style>
        {`
          :root {
            --color-primary: ${config.primaryColor};
            --color-secondary: ${config.secondaryColor};
            --color-button-text: ${config.buttonTextColor};
            --font-family: ${config.fontFamily};
            --background-color: ${config.backgroundColor};
            --card-background-color: ${config.cardBackgroundColor};
            --border-radius: ${config.borderRadius};
          }
          body {
            background-color: var(--background-color);
            font-family: var(--font-family);
          }
          .btn-primary {
            background-color: var(--color-primary);
            color: var(--color-button-text);
          }
          .btn-primary:hover {
            background-color: var(--color-secondary);
          }
          .text-primary-custom {
            color: var(--color-primary);
          }
          .border-primary-custom {
            border-color: var(--color-primary);
          }
          .bg-primary-custom {
            background-color: var(--color-primary);
          }
          /* Custom overrides for component styles */
          .bg-primary { background-color: var(--color-primary); }
          .text-primary-foreground { color: var(--color-button-text); }
          .hover\\:bg-primary\\/90:hover { background-color: var(--color-secondary); }
          .data-\\[state\\=checked\\]\\:bg-primary[data-state="checked"] { background-color: var(--color-primary); }
        `}
      </style>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Finicity Connect Customization
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 gap-6">
        {/* Configuration Panel */}
        <Card className="border-primary-custom">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="icon-md text-primary-custom" /> Configuration Options
            </CardTitle>
            <CardDescription>Adjust the look and feel and behavior of your Finicity Connect experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="theme" className="w-full">
              <TabsTrigger value="theme">
                <Palette className="mr-2 icon-sm" /> Theme
              </TabsTrigger>
              <TabsTrigger value="content">
                <Type className="mr-2 icon-sm" /> Content
              </TabsTrigger>
              <TabsTrigger value="flow">
                <Settings className="mr-2 icon-sm" /> Flow
              </TabsTrigger>
              <TabsTrigger value="data-access">
                <Database className="mr-2 icon-sm" /> Data Access
              </TabsTrigger>
              <TabsTrigger value="verification">
                <Banknote className="mr-2 icon-sm" /> Verification
              </TabsTrigger>
              <TabsTrigger value="localization">
                <Globe className="mr-2 icon-sm" /> Localization
              </TabsTrigger>

              <TabsContent value="theme">
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="h-10 w-full p-1 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color (Hover/Accent)</Label>
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                      className="h-10 w-full p-1 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buttonTextColor">Button Text Color</Label>
                    <Input
                      id="buttonTextColor"
                      type="color"
                      value={config.buttonTextColor}
                      onChange={(e) => handleColorChange('buttonTextColor', e.target.value)}
                      className="h-10 w-full p-1 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor">Page Background Color</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="h-10 w-full p-1 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardBackgroundColor">Connect Card Background Color</Label>
                    <Input
                      id="cardBackgroundColor"
                      type="color"
                      value={config.cardBackgroundColor}
                      onChange={(e) => handleColorChange('cardBackgroundColor', e.target.value)}
                      className="h-10 w-full p-1 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select
                      id="fontFamily"
                      value={config.fontFamily}
                      onValueChange={(value) => handleChange({ target: { id: 'fontFamily', value } } as React.ChangeEvent<HTMLSelectElement>)}
                      className="mt-1"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      type="text"
                      value={config.logoUrl}
                      onChange={handleChange}
                      placeholder="e.g., https://yourdomain.com/logo.png"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="buttonShape">Button Shape</Label>
                    <Select
                      id="buttonShape"
                      value={config.buttonShape}
                      onValueChange={(value) => handleChange({ target: { id: 'buttonShape', value } } as React.ChangeEvent<HTMLSelectElement>)}
                      className="mt-1"
                    >
                      <option value="rounded">Rounded</option>
                      <option value="square">Square</option>
                      <option value="pill">Pill</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="borderRadius">Element Border Radius</Label>
                    <Input
                      id="borderRadius"
                      type="text"
                      value={config.borderRadius}
                      onChange={handleChange}
                      placeholder="e.g., 0.5rem or 8px"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shadowsEnabled">Enable Shadows/Elevation</Label>
                    <Switch
                      id="shadowsEnabled"
                      checked={config.shadowsEnabled}
                      onCheckedChange={(checked) => handleToggleChange('shadowsEnabled', checked)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content">
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="headerText">Header Text</Label>
                    <Input
                      id="headerText"
                      type="text"
                      value={config.headerText}
                      onChange={handleChange}
                      placeholder="e.g., Connect Your Account"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Input
                      id="welcomeMessage"
                      type="text"
                      value={config.welcomeMessage}
                      onChange={handleChange}
                      placeholder="e.g., Connect your bank account."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="institutionSearchPlaceholder">Institution Search Placeholder</Label>
                    <Input
                      id="institutionSearchPlaceholder"
                      type="text"
                      value={config.institutionSearchPlaceholder}
                      onChange={handleChange}
                      placeholder="e.g., Search for your bank..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mfaPromptText">MFA Prompt Text</Label>
                    <Input
                      id="mfaPromptText"
                      type="text"
                      value={config.mfaPromptText}
                      onChange={handleChange}
                      placeholder="e.g., Enter the code from your device."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountSelectionInstruction">Account Selection Instruction</Label>
                    <Input
                      id="accountSelectionInstruction"
                      type="text"
                      value={config.accountSelectionInstruction}
                      onChange={handleChange}
                      placeholder="e.g., Choose accounts to link."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="successMessage">Success Message</Label>
                    <Input
                      id="successMessage"
                      type="text"
                      value={config.successMessage}
                      onChange={handleChange}
                      placeholder="e.g., Account connected successfully!"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="errorMessage">Error Message</Label>
                    <Input
                      id="errorMessage"
                      type="text"
                      value={config.errorMessage}
                      onChange={handleChange}
                      placeholder="e.g., Something went wrong. Please try again."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="footerText">Footer Text / Disclaimer</Label>
                    <Textarea
                      id="footerText"
                      value={config.footerText}
                      onChange={handleChange}
                      placeholder="e.g., Data provided by Finicity."
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="flow">
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableMFA">Enable Multi-Factor Authentication (MFA)</Label>
                    <Switch
                      id="enableMFA"
                      checked={config.enableMFA}
                      onCheckedChange={(checked) => handleToggleChange('enableMFA', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAccountSelection">Enable Account Selection</Label>
                    <Switch
                      id="enableAccountSelection"
                      checked={config.enableAccountSelection}
                      onCheckedChange={(checked) => handleToggleChange('enableAccountSelection', checked)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="flowType">Connect Flow Type</Label>
                    <Select
                      id="flowType"
                      value={config.flowType}
                      onValueChange={(value) => handleChange({ target: { id: 'flowType', value } } as React.ChangeEvent<HTMLSelectElement>)}
                      className="mt-1"
                    >
                      <option value="aggregator">Account Aggregation</option>
                      <option value="pay-by-bank">Pay-by-Bank</option>
                      <option value="verification">Account Verification</option>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="displayInstitutionLogos">Display Institution Logos</Label>
                    <Switch
                      id="displayInstitutionLogos"
                      checked={config.displayInstitutionLogos}
                      onCheckedChange={(checked) => handleToggleChange('displayInstitutionLogos', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hideUnsupportedInstitutions">Hide Unsupported Institutions</Label>
                    <Switch
                      id="hideUnsupportedInstitutions"
                      checked={config.hideUnsupportedInstitutions}
                      onCheckedChange={(checked) => handleToggleChange('hideUnsupportedInstitutions', checked)}
                    />
                  </div>
                  <div>
                    <Label>Allowed Account Types</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {['checking', 'savings', 'credit', 'loan', 'investment'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`accountType-${type}`}
                            checked={config.allowedAccountTypes.includes(type)}
                            onChange={(e) => handleMultiSelectChange('allowedAccountTypes', type, e.target.checked)}
                            className="form-checkbox h-4 w-4 text-primary-custom rounded"
                          />
                          <Label htmlFor={`accountType-${type}`} className="capitalize">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data-access">
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableTransactionHistory">Enable Transaction History</Label>
                    <Switch
                      id="enableTransactionHistory"
                      checked={config.enableTransactionHistory}
                      onCheckedChange={(checked) => handleToggleChange('enableTransactionHistory', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableStatementAccess">Enable Statement Access</Label>
                    <Switch
                      id="enableStatementAccess"
                      checked={config.enableStatementAccess}
                      onCheckedChange={(checked) => handleToggleChange('enableStatementAccess', checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: Specific data fields and historical depth are typically managed via Finicity API calls.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="verification">
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="verificationMethod">Account Verification Method</Label>
                    <Select
                      id="verificationMethod"
                      value={config.verificationMethod}
                      onValueChange={(value) => handleChange({ target: { id: 'verificationMethod', value } } as React.ChangeEvent<HTMLSelectElement>)}
                      className="mt-1"
                    >
                      <option value="instant">Instant Account Verification (IAV)</option>
                      <option value="microdeposit">Microdeposit Verification</option>
                    </Select>
                  </div>
                  {config.verificationMethod === 'microdeposit' && (
                    <>
                      <div>
                        <Label htmlFor="microdepositInstructions">Microdeposit Instructions</Label>
                        <Textarea
                          id="microdepositInstructions"
                          value={config.microdepositInstructions}
                          onChange={handleChange}
                          placeholder="Instructions for microdeposit verification."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="microdepositAmountPlaceholder">Microdeposit Amount Input Placeholder</Label>
                        <Input
                          id="microdepositAmountPlaceholder"
                          type="text"
                          value={config.microdepositAmountPlaceholder}
                          onChange={handleChange}
                          placeholder="e.g., Enter two amounts"
                          className="mt-1"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Microdeposit amounts are typically generated by Finicity. This field customizes the prompt for users.
                      </p>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="localization">
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Select
                      id="defaultLanguage"
                      value={config.defaultLanguage}
                      onValueChange={(value) => handleChange({ target: { id: 'defaultLanguage', value } } as React.ChangeEvent<HTMLSelectElement>)}
                      className="mt-1"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="es-US">Spanish (US)</option>
                      <option value="fr-CA">French (Canada)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="de-DE">German (Germany)</option>
                      <option value="ja-JP">Japanese (Japan)</option>
                      {/* Add more languages as supported by Finicity */}
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: Full localization of all text strings requires specific language packs or API configurations
                    provided by Finicity, beyond what's directly configurable here.
                  </p>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline" onClick={resetConfig}>
              <RefreshCcw className="mr-2 icon-sm" /> Reset
            </Button>
            <Button onClick={saveConfig} className={`btn-primary ${getButtonClass()}`}>
              <Save className="mr-2 icon-sm" /> Save Configuration
            </Button>
          </CardFooter>
        </Card>

        {/* Live Preview */}
        <Card className={`border-primary-custom ${getCardShadowClass()}`} style={{ backgroundColor: config.backgroundColor, borderRadius: config.borderRadius }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="icon-md text-primary-custom" /> Live Preview
            </CardTitle>
            <CardDescription>See how your changes will appear in the Finicity Connect flow.</CardDescription>
          </CardHeader>
          <CardContent className="h-600px flex items-center justify-center p-4">
            <div
              className={`w-full max-w-sm bg-white rounded-lg p-6 flex flex-col items-center justify-between text-center border border-gray-200 ${getCardShadowClass()}`}
              style={{
                borderColor: config.primaryColor,
                fontFamily: config.fontFamily,
                backgroundColor: config.cardBackgroundColor, // Apply inner card background
                borderRadius: config.borderRadius,
              }}
            >
              <div> {/* Header Section */}
                {config.logoUrl && (
                  <img
                    src={config.logoUrl}
                    alt="Company Logo"
                    className="mb-4 max-h-16 w-auto mx-auto"
                    style={{ borderRadius: config.borderRadius }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/150x50/cccccc/000000?text=Logo+Error';
                      e.currentTarget.alt = 'Logo not found';
                    }}
                  />
                )}
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {config.headerText}
                </h2>
                <p className="text-gray-600 mb-6">
                  {config.welcomeMessage}
                </p>
              </div>

              {/* Main Content Area - Dynamic based on flow/verification */}
              <div className="w-full mb-4">
                {config.verificationMethod === 'instant' && config.flowType !== 'verification' && (
                  <>
                    <Input
                      type="text"
                      placeholder={config.institutionSearchPlaceholder}
                      className="mb-4 w-full"
                      readOnly
                      style={{ borderRadius: config.borderRadius }}
                    />
                    {config.displayInstitutionLogos && (
                      <div className="flex justify-center gap-4 mb-4">
                        <img src="https://placehold.co/50x50/007bff/ffffff?text=Bank1" alt="Bank 1" className="rounded-md" style={{ borderRadius: config.borderRadius }} />
                        <img src="https://placehold.co/50x50/28a745/ffffff?text=Bank2" alt="Bank 2" className="rounded-md" style={{ borderRadius: config.borderRadius }} />
                        <img src="https://placehold.co/50x50/dc3545/ffffff?text=Bank3" alt="Bank 3" className="rounded-md" style={{ borderRadius: config.borderRadius }} />
                      </div>
                    )}
                    {config.enableMFA && (
                      <div className="w-full mb-4">
                        <p className="text-gray-700 text-sm mb-2">{config.mfaPromptText}</p>
                        <Input type="text" placeholder="Enter code" className="w-full" readOnly style={{ borderRadius: config.borderRadius }} />
                      </div>
                    )}
                    {config.enableAccountSelection && (
                      <div className="w-full mb-4">
                        <p className="text-gray-700 text-sm mb-2">{config.accountSelectionInstruction}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {config.allowedAccountTypes.map((type) => (
                            <span key={type} className="bg-gray-200 text-gray-700 px-3 py-1 text-xs capitalize" style={{ borderRadius: config.borderRadius }}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {config.verificationMethod === 'microdeposit' && (
                  <div className="w-full mb-4">
                    <p className="text-gray-700 text-sm mb-2">{config.microdepositInstructions}</p>
                    <Input
                      type="text"
                      placeholder={config.microdepositAmountPlaceholder}
                      className="w-full"
                      readOnly
                      style={{ borderRadius: config.borderRadius }}
                    />
                    <Button className={`btn-primary w-full mt-4 ${getButtonClass()}`}>
                      Submit Amounts
                    </Button>
                  </div>
                )}

                {config.flowType === 'verification' && config.verificationMethod === 'instant' && (
                  <div className="w-full mb-4">
                    <p className="text-gray-700 text-sm mb-2">Instant Account Verification in progress...</p>
                    <div className="flex justify-center items-center h-20">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-custom"></div>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">This usually takes a few seconds.</p>
                  </div>
                )}
              </div>

              <div> {/* Footer Section */}
                <Button className={`btn-primary w-full mb-3 ${getButtonClass()}`}>
                  {config.verificationMethod === 'microdeposit' ? 'Continue Setup' : 'Connect Now'}
                </Button>
                <Button variant="outline" className={`w-full ${getButtonClass()}`}>
                  Learn More
                </Button>

                {/* Simulated success/error messages */}
                <div className="mt-4 w-full">
                  <div className="text-green-600 text-sm flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> {config.successMessage}
                  </div>
                  <div className="text-red-600 text-sm flex items-center justify-center mt-2">
                    <XCircle className="h-4 w-4 mr-1" /> {config.errorMessage}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>Flow Type: {config.flowType}</p>
                  <p>Verification Method: {config.verificationMethod === 'instant' ? 'Instant' : 'Microdeposit'}</p>
                  <p>Transaction History: {config.enableTransactionHistory ? 'Enabled' : 'Disabled'}</p>
                  <p>Statement Access: {config.enableStatementAccess ? 'Enabled' : 'Disabled'}</p>
                  <p>Default Language: {config.defaultLanguage}</p>
                  <p className="mt-2 text-gray-700">{config.footerText}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Box for alerts */}
      <div id="message-box" className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-md shadow-lg hidden z-50">
        <p id="message-text"></p>
        <button className="ml-4 text-sm font-bold" onClick={() => document.getElementById('message-box')?.classList.add('hidden')}>
          X
        </button>
      </div>
    </div>
  );
};

// Custom alert function to replace window.alert
const alert = (message: string) => {
  const msgBox = document.getElementById('message-box');
  const msgText = document.getElementById('message-text');
  if (msgBox && msgText) {
    msgText.textContent = message;
    msgBox.classList.remove('hidden');
    setTimeout(() => {
      msgBox.classList.add('hidden');
    }, 5000); // Hide after 5 seconds
  } else {
    console.warn('Message box elements not found. Falling back to console log:', message);
  }
};

export default Customization;
