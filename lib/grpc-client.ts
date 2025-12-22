// [aryankumarofficial/tracework-frontend/tracework-frontend-d48e64cadcf6f86a6272544d06b44555dfd8c1f8/lib/grpc-client.ts]
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs from 'fs';

// Updated Interface with Auth Methods
interface CompanyServiceClient {
    CreateCompany: (req: any, cb: (err: any, res: any) => void) => void;
    GetCompany: (req: any, cb: (err: any, res: any) => void) => void;
    UpdateCompany: (req: any, cb: (err: any, res: any) => void) => void;
    GetCompanyFullDetails: (req: any, cb: (err: any, res: any) => void) => void;
    UpdateCompanyContact: (req: any, cb: (err: any, res: any) => void) => void;
    UpdateCompanyBanking: (req: any, cb: (err: any, res: any) => void) => void;
    // Auth Methods
    Register: (req: any, cb: (err: any, res: any) => void) => void;
    VerifyEmail: (req: any, cb: (err: any, res: any) => void) => void;
    ValidateCredentials: (req: any, cb: (err: any, res: any) => void) => void;

    // Request Verification (Added)
    RequestVerification: (req: any, cb: (err: any, res: any) => void) => void;

    close: () => void;
}

// Cache for gRPC clients
let companyServiceClient: CompanyServiceClient | null = null;

export async function createCompanyGrpcClient(): Promise<CompanyServiceClient> {
    if (companyServiceClient) return companyServiceClient;

    try {
        // 1. Define Path
        let PROTO_PATH = path.join(
            process.cwd(),
            'proto/companies/v1/company.proto'
        );

        // 2. Fallback check (optional)
        if (!fs.existsSync(PROTO_PATH)) {
            console.log('⚠️  Proto not found in Next.js project, searching backend...');
            PROTO_PATH = path.join(
                process.cwd(),
                '../backend/libs/grpc-contracts/src/proto/definations/companies/v1/company.proto'
            );
        }

        if (!fs.existsSync(PROTO_PATH)) {
            throw new Error(`❌ Proto file not found at: ${PROTO_PATH}`);
        }

        // 3. Load Definition
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });

        // 4. Create Client
        const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
        const companyPackage = protoDescriptor.companies?.v1;

        if (!companyPackage?.CompanyService) {
            throw new Error('CompanyService not found in proto definition');
        }

        const GRPC_SERVER_URL = process.env.COMPANY_SERVICE_URL || 'localhost:50051';

        console.log(`🔗 Connecting to gRPC server at: ${GRPC_SERVER_URL}`);

        companyServiceClient = new companyPackage.CompanyService(
            GRPC_SERVER_URL,
            grpc.credentials.createInsecure()
        ) as CompanyServiceClient;

        console.log('✅ gRPC client created successfully');

        return companyServiceClient;
    } catch (error) {
        console.error('❌ Error creating gRPC client:', error);
        throw error;
    }
}

// Optional: Function to close the client
export function closeCompanyGrpcClient(): void {
    if (companyServiceClient) {
        companyServiceClient.close();
        companyServiceClient = null;
        console.log('🔌 gRPC client closed');
    }
}