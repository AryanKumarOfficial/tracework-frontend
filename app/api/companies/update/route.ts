import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { message: 'Company ID is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual gRPC call to your CompanyService
    // const response = await companyServiceClient.updateCompany({
    //   id: body.id,
    //   companyName: body.companyName,
    //   address: body.address,
    //   email: body.email,
    //   phone: body.phone,
    //   industry: body.industry,
    //   logoUrl: body.logoUrl,
    //   websiteUrl: body.websiteUrl,
    //   description: body.description,
    //   updatedBy: body.updatedBy
    // });

    // Mock response for now
    const updatedCompany = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    console.log('Company updated:', updatedCompany);

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { message: 'Failed to update company' },
      { status: 500 }
    );
  }
}