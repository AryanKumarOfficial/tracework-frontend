import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get the current user's ID from session/auth
    const userId = 'current-user-id'; // Replace with actual auth logic

    // TODO: Replace with actual gRPC call to your CompanyService
    // const response = await companyServiceClient.getCompany({ id: userId });
    
    // Mock response for now - replace with actual gRPC call
    const mockCompany = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      companyName: 'Demo Company',
      companyId: 'DEMO001',
      address: '123 Business Street, City, State 12345',
      email: 'contact@democompany.com',
      phone: '+91 9876543210',
      industry: 1, // Technology
      logoUrl: 'https://via.placeholder.com/200',
      websiteUrl: 'https://democompany.com',
      description: 'A leading technology company focused on innovation and excellence.',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    };

    return NextResponse.json({
      company: mockCompany
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}