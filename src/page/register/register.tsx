import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterFormComponent from './RegisterFormComponent';
import MapModalComponent from './MapModalComponent';

interface RegisterComponentProps {
  onAuthModeChange: (mode: 'login' | 'register' | '') => void;
}

const RegisterComponent: React.FC<RegisterComponentProps> = ({ onAuthModeChange }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    const { firstName, lastName, email, phone, password } = formData;
    if (!firstName || !lastName || !email || !phone || !password) {
      return t('all_fields_required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return t('invalid_email');
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('https://enddel.com/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.error || t('something_went_wrong');
        throw new Error(errorMessage);
      }
      alert(t('success'));
      onAuthModeChange('login');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('something_went_wrong');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSelect = (address: string, lat: number, lon: number) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address,
    }));
    setShowMapPicker(false);
  };

  const handleAddressFocus = () => {
    setShowMapPicker(true);
  };

  return (
    <div>
      <RegisterFormComponent
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        handleAddressFocus={handleAddressFocus}
      />
      <MapModalComponent
        showMapPicker={showMapPicker}
        handleClose={() => setShowMapPicker(false)}
        handleAddressSelect={handleAddressSelect}
      />
    </div>
  );
};

export default RegisterComponent;
