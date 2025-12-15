import { NextRequest, NextResponse } from 'next/server';
import { createCompanyGrpcClient } from '@/lib/grpc-client';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const updateType = searchParams.get('type') || 'general';
        const body = await request.json();

        // ID is required for any update
        const id = body.id || body.companyId;
        if (!id) {
            return NextResponse.json({ message: 'Company ID is required' }, { status: 400 });
        }

        const client = await createCompanyGrpcClient();
        let response;

        // --- 1. General Company Info Update ---
        if (updateType === 'general') {
            const updateRequest = {
                id: body.id,
                companyName: body.companyName,
                description: body.description,
                websiteUrl: body.websiteUrl,
                // Passing metadata (PAN, GST, etc.) if the backend supports it in the 'UpdateCompany'
                // logic you implemented in the previous step
                metadata: body.metadata
            };

            response = await new Promise((resolve, reject) => {
                client.UpdateCompany(updateRequest, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        }

        // --- 2. Contact Info Update ---
        else if (updateType === 'contact') {
            // Contact tab contains fields from both Company entity (phone, address) and Contact entity

            // A. Update Base Company Fields (Phone, Address, Email)
            await new Promise((resolve, reject) => {
                client.UpdateCompany({
                    id: body.companyId,
                    address: body.address,
                    phone: body.phone,
                    email: body.email
                }, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });

            // B. Update Extended Contact Details
            response = await new Promise((resolve, reject) => {
                client.UpdateCompanyContact({
                    companyId: body.companyId,
                    state: body.state,
                    city: body.city,
                    pinCode: body.pinCode,
                    linkedin: body.linkedin,
                    instagram: body.instagram,
                    twitter: body.twitter,
                }, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        }

        // --- 3. Banking Info Update ---
        else if (updateType === 'banking') {
            response = await new Promise((resolve, reject) => {
                client.UpdateCompanyBanking({
                    companyId: body.companyId,
                    accountHolderName: body.accountHolderName,
                    accountNumber: body.accountNumber,
                    bankName: body.bankName,
                    branchName: body.branchName,
                    ifscCode: body.ifscCode,
                }, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });
        } else {
            return NextResponse.json({ message: 'Invalid update type' }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: response });

    } catch (error: any) {
        console.error('Error updating company:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.details || 'Failed to update company information'
            },
            { status: 500 }
        );
    }
}