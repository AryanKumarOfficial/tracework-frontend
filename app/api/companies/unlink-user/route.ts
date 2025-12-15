import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.companyId || !body.userId) {
      return NextResponse.json(
        { message: 'companyId and userId are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual gRPC call to your CompanyService
    // const response = await companyServiceClient.unlinkUserFromCompany({
    //   companyId: body.companyId,
    //   userId: body.userId
    // });

    console.log('User unlinked from company:', body);

    return NextResponse.json({
      success: true,
      message: 'User unlinked successfully'
    });
  } catch (error) {
    console.error('Error unlinking user:', error);
    return NextResponse.json(
      { message: 'Failed to unlink user from company' },
      { status: 500 }
    );
  }
}