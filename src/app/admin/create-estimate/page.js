'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '../../../components/ui/Container';
import CreateEstimateForm from '../../../components/admin/CreateEstimateForm';

// Create a separate component that uses useSearchParams
const EstimateFormWithAppointment = () => {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  
  return <CreateEstimateForm appointmentId={appointmentId} />;
};

const CreateEstimatePage = () => {
  return (
    <div className="py-8">
      <Container>
        <Suspense fallback={<div>Loading...</div>}>
          <EstimateFormWithAppointment />
        </Suspense>
      </Container>
    </div>
  );
};

export default CreateEstimatePage; 