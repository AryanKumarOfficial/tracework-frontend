import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Registering new company:', body);
        const {companyName, email, password} = body;

        if (!companyName || !email || !password) {
            return NextResponse.json({success: false, message: 'Missing required fields'}, {status: 400});
        }




        return NextResponse.json({success: true, data: response});
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            {success: false, message: error.details || 'Registration failed'},
            {status: error.code === 6 ? 409 : 500} // 6 = ALREADY_EXISTS
        );
    }
}