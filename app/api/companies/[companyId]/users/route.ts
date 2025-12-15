import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const { companyId } = params;

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }
    
    const mockUsers = [
      {
        id: crypto.randomUUID(),
        companyId: companyId,
        userId: 'user-001',
        role: 1, // Admin
        isActive: true,
        assignedBy: 'system',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        id: crypto.randomUUID(),
        companyId: companyId,
        userId: 'user-002',
        role: 2, // Manager
        isActive: true,
        assignedBy: 'user-001',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      {
        id: crypto.randomUUID(),
        companyId: companyId,
        userId: 'user-003',
        role: 3, // Viewer
        isActive: false,
        assignedBy: 'user-001',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    ];

    return NextResponse.json({
      users: mockUsers
    });
  } catch (error) {
    console.error('Error fetching company users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company users' },
      { status: 500 }
    );
  }
}