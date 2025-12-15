// app/api/companies/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createCompanyGrpcClient } from '@/lib/grpc-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['companyName', 'companyId', 'email', 'phone', 'address', 'industry'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate industry is not 0 (Select Industry)
    if (body.industry === 0) {
      return NextResponse.json(
        { success: false, message: 'Please select a valid industry' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // PAN validation (if provided in metadata)
    if (body.metadata?.pan) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(body.metadata.pan)) {
        return NextResponse.json(
          { success: false, message: 'Invalid PAN format. Should be AAAAA0000A' },
          { status: 400 }
        );
      }
    }

    // GST validation (if provided in metadata)
    if (body.metadata?.gst) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(body.metadata.gst)) {
        return NextResponse.json(
          { success: false, message: 'Invalid GST format. Should be 22AAAAA0000A1Z5' },
          { status: 400 }
        );
      }
    }

    // IFSC validation (if provided in metadata)
    if (body.metadata?.banking?.ifscCode) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(body.metadata.banking.ifscCode)) {
        return NextResponse.json(
          { success: false, message: 'Invalid IFSC code format' },
          { status: 400 }
        );
      }
    }

    console.log('📤 Connecting to gRPC service...');

    // Get the gRPC client
    const companyClient = await createCompanyGrpcClient();

    // Prepare the request data matching your CreateCompanyRequest proto
    const createCompanyRequest = {
      companyName: body.companyName,
      companyId: body.companyId,
      address: body.address,
      email: body.email,
      phone: body.phone,
      industry: body.industry,
      logoUrl: body.logoUrl || '',
      websiteUrl: body.websiteUrl || '',
      description: body.description || '',
    };

    console.log('📤 Calling CreateCompany gRPC method...');

    // Call the gRPC service to create company
    const response: any = await new Promise((resolve, reject) => {
      companyClient.CreateCompany(createCompanyRequest, (error: any, response: any) => {
        if (error) {
          console.error('❌ gRPC CreateCompany failed:', error);
          reject(error);
        } else {
          console.log('✅ gRPC CreateCompany successful:', response);
          resolve(response);
        }
      });
    });

    const companyId = response.id;
    const results: any = { company: response };

    // Update company with metadata (PAN, GST, TAN)
    if (body.metadata && (body.metadata.pan || body.metadata.gst || body.metadata.tan)) {
      console.log('📝 Updating company metadata (PAN, GST, TAN)...');
      
      try {
        const updateRequest = {
          id: companyId,
          pan: body.metadata.pan || '',
          gst: body.metadata.gst || '',
          tan: body.metadata.tan || '',
        };

        const updateResponse: any = await new Promise((resolve, reject) => {
          companyClient.UpdateCompany(updateRequest, (error: any, response: any) => {
            if (error) {
              console.error('⚠️  Failed to update company metadata:', error);
              // Don't reject, just log the error
              resolve(null);
            } else {
              console.log('✅ Company metadata updated successfully');
              resolve(response);
            }
          });
        });

        results.metadata = updateResponse;
      } catch (error) {
        console.error('⚠️  Error updating metadata:', error);
        // Continue anyway
      }
    }

    // Update contact information (social media)
    if (body.metadata?.socialMedia) {
      console.log('📝 Updating company contact info...');
      
      try {
        const contactRequest = {
          companyId: companyId,
          state: body.metadata.socialMedia.state || '',
          city: body.metadata.socialMedia.city || '',
          pinCode: body.metadata.socialMedia.pinCode || '',
          linkedin: body.metadata.socialMedia.linkedin || '',
          instagram: body.metadata.socialMedia.instagram || '',
          twitter: body.metadata.socialMedia.twitter || '',
        };

        const contactResponse: any = await new Promise((resolve, reject) => {
          companyClient.UpdateCompanyContact(contactRequest, (error: any, response: any) => {
            if (error) {
              console.error('⚠️  Failed to update contact info:', error);
              resolve(null);
            } else {
              console.log('✅ Contact info updated successfully');
              resolve(response);
            }
          });
        });

        results.contact = contactResponse;
      } catch (error) {
        console.error('⚠️  Error updating contact:', error);
      }
    }

    // Update banking information
    if (body.metadata?.banking) {
      console.log('📝 Updating company banking info...');
      
      try {
        const bankingRequest = {
          companyId: companyId,
          bankName: body.metadata.banking.bankName || '',
          accountNumber: body.metadata.banking.accountNumber || '',
          ifscCode: body.metadata.banking.ifscCode || '',
          accountHolderName: body.metadata.banking.accountHolderName || '',
          branchName: body.metadata.banking.branchName || '',
        };

        const bankingResponse: any = await new Promise((resolve, reject) => {
          companyClient.UpdateCompanyBanking(bankingRequest, (error: any, response: any) => {
            if (error) {
              console.error('⚠️  Failed to update banking info:', error);
              resolve(null);
            } else {
              console.log('✅ Banking info updated successfully');
              resolve(response);
            }
          });
        });

        results.banking = bankingResponse;
      } catch (error) {
        console.error('⚠️  Error updating banking:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Company registered successfully. Pending approval.',
      data: results,
    });

  } catch (error: any) {
    console.error('❌ Error creating company:', error);

    // Handle connection refused
    if (error.code === 14 || error.message?.includes('UNAVAILABLE')) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unable to connect to backend gRPC service. Please ensure NestJS is running on port 50051.',
          error: 'Service unavailable',
          hint: 'Run your NestJS backend with: npm run start:dev'
        },
        { status: 503 }
      );
    }

    // Handle specific gRPC errors
    if (error.code === 6) { // ALREADY_EXISTS
      return NextResponse.json(
        { success: false, message: 'Company with this ID or Email already exists' },
        { status: 409 }
      );
    }

    if (error.code === 3) { // INVALID_ARGUMENT
      return NextResponse.json(
        { success: false, message: error.details || 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to register company',
        error: error.details || 'Internal server error'
      },
      { status: 500 }
    );
  }
}