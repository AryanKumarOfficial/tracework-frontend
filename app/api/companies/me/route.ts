import {NextRequest, NextResponse} from 'next/server';
import {jwtVerify} from 'jose';
import {createCompanyGrpcClient} from '@/lib/grpc-client';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('company_token')?.value;

        if (!token) {
            return NextResponse.json({success: false, message: 'Not authenticated'}, {status: 401});
        }

        const secret = new TextEncoder().encode(process.env.COMPANY_JWT_SECRET || 'company_secret');
        const {payload} = await jwtVerify(token, secret);

        if (!payload.sub) {
            return NextResponse.json({success: false, message: 'Invalid token'}, {status: 401});
        }

        const client = await createCompanyGrpcClient();

        const response: any = await new Promise((resolve, reject) => {
            client.GetCompanyFullDetails({id: payload.sub}, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });

        return NextResponse.json({
            success: true,
            data: {
                ...response,
                companyName: response.company.company_name
            }
        });

    } catch (error: any) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            {success: false, message: 'Failed to fetch profile'},
            {status: 500}
        );
    }
}