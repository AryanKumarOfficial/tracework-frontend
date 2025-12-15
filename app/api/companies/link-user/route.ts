import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.companyId || !body.userId || !body.role) {
      return NextResponse.json(
        { message: 'companyId, userId, and role are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual gRPC call to your CompanyService
    // const response = await companyServiceClient.linkUserToCompany({
    //   companyId: body.companyId,
    //   userId: body.userId,
    //   role: body.role,
    //   assignedBy: body.assignedBy
    // });

    // Mock response for now
    const companyUser = {
      id: crypto.randomUUID(),
      companyId: body.companyId,
      userId: body.userId,
      role: body.role,
      isActive: true,
      assignedBy: body.assignedBy || 'system',
      createdAt: new Date().toISOString()
    };

    console.log('User linked to company:', companyUser);

    return NextResponse.json(companyUser);
  } catch (error) {
    console.error('Error linking user:', error);
    return NextResponse.json(
      { message: 'Failed to link user to company' },
      { status: 500 }
    );
  }
}