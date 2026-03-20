'use client';

import React, { useState } from 'react';
import { StepperHeader } from './StepperHeader';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { BusinessSettingsStep } from './steps/BusinessSettingsStep';
import { PricingTypeStep } from './steps/PricingTypeStep';
import { UsersStep } from './steps/UsersStep';
import { LocationStep } from './steps/LocationStep';
import { CompleteStep } from './steps/CompleteStep';
import { WizardFooter } from './WizardFooter';

export interface RestaurantFormData {
  // Adım 1: Temel Bilgiler
  basicInfo: {
    name: string;
    brandName: string;
    email: string;
    taxNumber: string;
  };

  // Adım 2: İşletme Ayarları
  businessSettings: {
    supportPhone: string;
    technicalContactName: string;
    creditCardCommission: number;
    pickupTimeMinutes: number;
  };

  // Adım 3: Çalışma Tipi
  pricing: {
    pricingType: 'FIXED' | 'ZONE' | 'DISTANCE' | 'HOURLY';
    pricingConfig: any;
  };

  // Adım 4: Kullanıcılar
  users: Array<{
    fullName: string;
    phone: string;
    role: 'MANAGER' | 'STAFF';
    username: string;
    password: string;
  }>;

  // Adım 5: Konum
  locationData: {
    address: {
      full: string;
      district: string;
      city: string;
      neighborhood?: string;
    };
    location: {
      latitude: number;
      longitude: number;
    };
  };

  // Bayi ID
  dealerId: string;
}

interface RestaurantWizardProps {
  dealerId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const steps = [
  { id: 'basic', title: 'Temel Bilgiler', icon: '✓' },
  { id: 'business', title: 'İşletme Ayarları', icon: '⚙️' },
  { id: 'pricing', title: 'Çalışma Tipi', icon: '💰' },
  { id: 'users', title: 'Kullanıcılar', icon: '👥' },
  { id: 'location', title: 'Konum', icon: '📍' },
  { id: 'complete', title: 'Tamamla', icon: '✅' },
];

export function RestaurantWizard({ dealerId, onComplete, onCancel }: RestaurantWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RestaurantFormData>({
    basicInfo: {
      name: '',
      brandName: '',
      email: '',
      taxNumber: '',
    },
    businessSettings: {
      supportPhone: '',
      technicalContactName: '',
      creditCardCommission: 0,
      pickupTimeMinutes: 30,
    },
    pricing: {
      pricingType: 'PER_PACKAGE',
      pricingConfig: {
        pricePerPackage: 110,
      },
    },
    users: [],
    locationData: {
      address: {
        full: '',
        district: '',
        city: '',
      },
      location: {
        latitude: 0,
        longitude: 0,
      },
    },
    dealerId,
  });

  const updateFormData = (section: keyof RestaurantFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/restaurants/wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onComplete();
      } else {
        const error = await response.json();
        alert(error.message || 'Bir hata oluştu');
      }
    } catch (error) {
      alert('Bağlantı hatası');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData.basicInfo}
            onChange={(data) => updateFormData('basicInfo', data)}
          />
        );
      case 1:
        return (
          <BusinessSettingsStep
            data={formData.businessSettings}
            onChange={(data) => updateFormData('businessSettings', data)}
          />
        );
      case 2:
        return (
          <PricingTypeStep
            data={formData.pricing}
            onChange={(data) => updateFormData('pricing', data)}
          />
        );
      case 3:
        return (
          <UsersStep
            users={formData.users}
            onChange={(users) => setFormData(prev => ({ ...prev, users }))}
          />
        );
      case 4:
        return (
          <LocationStep
            data={formData.locationData}
            onChange={(data) => updateFormData('locationData', data)}
          />
        );
      case 5:
        return (
          <CompleteStep
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Yeni Restoran Ekle</h2>
      </div>

      {/* Stepper */}
      <StepperHeader steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <div className="px-6 py-6 min-h-[400px]">
        {renderStep()}
      </div>

      {/* Footer */}
      <WizardFooter
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={nextStep}
        onPrev={prevStep}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isLastStep={currentStep === steps.length - 1}
        canProceed={
          currentStep === 0 ? !!formData.basicInfo.name && !!formData.basicInfo.email :
          currentStep === 1 ? !!formData.businessSettings.supportPhone :
          currentStep === 2 ? true :
          currentStep === 3 ? formData.users.length > 0 :
          currentStep === 4 ? !!formData.locationData.address.full && formData.locationData.location.latitude !== 0 :
          true
        }
      />
    </div>
  );
}
