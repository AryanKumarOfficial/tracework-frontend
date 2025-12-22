import {NextRequest, NextResponse} from "next/server";
import {jwtVerify} from "jose";
import {createCompanyGrpcClient} from "@/lib/grpc-client";

export async function POST(req: NextRequest) {
    try {
        const token: string | null | undefined = req.cookies.get('company_token')?.value
        if (!token) {
            return NextResponse.json({
                success: false,
                message: `No Authentication`
            }, {
                status: 401
            });
        }

        const secret = new TextEncoder().encode(process.env.COMPANY_JWT_SECRET);
        const {payload} = await jwtVerify(token, secret);
        if (!payload.sub) {
            return NextResponse.json({success: false, message: `Invalid Token`}, {status: 401});
        }
        const client = await createCompanyGrpcClient();
        const response = await new Promise((resolve, reject) => {
            client.RequestVerification({company_id: payload.sub}, (err, result) => {
                if (err) {
                    return reject(err);
                } else resolve(result)
            })
        })
        return NextResponse.json(response);
    } catch (error) {
        console.error('Request verification error:', error);
        return NextResponse.json(
            { success: false, message: (error as any).details || (error as Error).message || 'Failed to request verification' },
            { status: 500 }
        );
    }
}