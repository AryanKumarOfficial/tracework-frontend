import {NextRequest, NextResponse} from 'next/server';
import {createCompanyGrpcClient} from '@/lib/grpc-client';
import {SignJWT} from "jose";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {email, password} = body;

        const client = await createCompanyGrpcClient();

        const response: any = await new Promise((resolve, reject) => {
            client.ValidateCredentials({email, password}, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });

        if (response.success && response.company) {
            console.log('✅ Login successful for:', response.company.email);
            const secret = new TextEncoder().encode(
                process.env.COMPANY_JWT_SECRET || 'company_secret'
            );
            const token = await new SignJWT({
                sub: response.company.id,
                email: response.company.email,
                type: 'COMPANY'
            })
                .setProtectedHeader({alg: 'HS256'})
                .setExpirationTime('1d')
                .sign(secret);
            const res = NextResponse.json({
                success: true,
                company: response.company,
                message: 'Login successful'
            });
            res.cookies.set({
                name: 'company_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24
            })
            return res;
        }

        return NextResponse.json({success: false, message: 'Invalid credentials'}, {status: 401});

    } catch (error: any) {
        return NextResponse.json(
            {success: false, message: error.details || 'Login failed'},
            {status: 401}
        );
    }
}