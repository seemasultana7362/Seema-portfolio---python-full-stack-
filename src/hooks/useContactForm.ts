import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { ContactFormData } from '../types';

const EMPTY: ContactFormData = { name: '', email: '', subject: '', message: '' };

/**
 * Contact-form state + submission against the existing /api/contact endpoint.
 * Shared by the classic Contact section and the ocean's transmission panel,
 * so behaviour (validation, messages, dev-container fallback) stays identical.
 */
export function useContactForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<ContactFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields before submitting.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(data.message || 'Thank you for getting in touch! Your message has been received.');
        setFormData(EMPTY);
        onSuccess?.();
      } else {
        setError(data.error || 'Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      // Fallback optimistic message in dev container (unchanged behaviour)
      setSuccess('Thank you for getting in touch! Your message has been received.');
      setFormData(EMPTY);
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, success, error, handleChange, handleSubmit };
}
