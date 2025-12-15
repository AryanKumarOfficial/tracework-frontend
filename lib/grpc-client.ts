// lib/grpc-client.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs from 'fs';

// Type definition for the company service client
interface CompanyServiceClient {
  CreateCompany: (
    request: any,
    callback: (error: any, response: any) => void
  ) => void;
  GetCompany: (
    request: any,
    callback: (error: any, response: any) => void
  ) => void;
  UpdateCompany: (
    request: any,
    callback: (error: any, response: any) => void
  ) => void;
  GetCompanyFullDetails: (
    request: any,
    callback: (error: any, response: any) => void
  ) => void;
  UpdateCompanyContact: (
    request: any,
    callback: (error: any, response: any) => void
  ) => void;
  UpdateCompanyBanking: (
    request: any,
    callback: (error: any, response: any) => void
  ) => void;
  close: () => void;
}

// Cache for gRPC clients
let companyServiceClient: CompanyServiceClient | null = null;

/**
 * Creates and returns a gRPC client for the Company Service
 * Uses caching to reuse the same client instance
 */
export async function createCompanyGrpcClient(): Promise<CompanyServiceClient> {
  // Return cached client if available
  if (companyServiceClient) {
    return companyServiceClient;
  }

  try {
    // Option 1: Use proto file from Next.js project
    let PROTO_PATH = path.join(
      process.cwd(),
      'proto/companies/v1/company.proto'
    );

    // Option 2: Fallback to NestJS project location (adjust path as needed)
    if (!fs.existsSync(PROTO_PATH)) {
      console.log('⚠️  Proto not found in Next.js project, trying NestJS location...');
      PROTO_PATH = path.join(
        process.cwd(),
        '../backend/libs/grpc-contracts/src/proto/definations/companies/v1/company.proto'
      );
    }

    // Check if proto file exists
    if (!fs.existsSync(PROTO_PATH)) {
      throw new Error(
        `❌ Proto file not found!\n\n` +
        `Searched locations:\n` +
        `1. ${process.cwd()}/proto/companies/v1/company.proto\n` +
        `2. ${PROTO_PATH}\n\n` +
        `Please either:\n` +
        `- Copy the proto file to your Next.js project: proto/companies/v1/company.proto\n` +
        `- Or update the path to point to your NestJS project`
      );
    }

    console.log('📄 Loading proto file from:', PROTO_PATH);

    // Load proto with specific options
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
    
    // Your proto has: package companies.v1;
    const companyPackage = protoDescriptor.companies?.v1 as any;
    
    if (!companyPackage || !companyPackage.CompanyService) {
      console.error('❌ Proto structure:', Object.keys(protoDescriptor));
      throw new Error(
        'CompanyService not found in proto definition. ' +
        'Available packages: ' + Object.keys(protoDescriptor).join(', ')
      );
    }

    const CompanyService = companyPackage.CompanyService;

    // Get gRPC server address from environment variables
    const GRPC_SERVER_URL = process.env.COMPANY_SERVICE_URL || 'localhost:50051';

    console.log(`🔗 Connecting to gRPC server at: ${GRPC_SERVER_URL}`);

    // Use insecure credentials for development
    const credentials = grpc.credentials.createInsecure();

    // Create the client
    companyServiceClient = new CompanyService(
      GRPC_SERVER_URL,
      credentials
    ) as CompanyServiceClient;

    console.log(`✅ gRPC Company Service client created successfully`);
    
    // Test connection with a deadline
    await testConnection(companyServiceClient);
    
    return companyServiceClient;

  } catch (error) {
    console.error('❌ Error creating gRPC client:', error);
    
    // Provide helpful error message
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      throw new Error(
        `Cannot connect to gRPC server!\n\n` +
        `Make sure your NestJS backend is running:\n` +
        `1. Open a new terminal\n` +
        `2. Navigate to your NestJS project\n` +
        `3. Run: npm run start:dev\n` +
        `4. Wait for: "Companies, Departments & Designations gRPC microservice is running on port 50051"\n` +
        `5. Then try again`
      );
    }
    
    throw error;
  }
}

/**
 * Test gRPC connection
 */
async function testConnection(client: CompanyServiceClient): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 5); // 5 second timeout
    
    // We don't actually call a method, just check if client was created
    // You can uncomment below if you want to test with a real call
    /*
    client.GetCompany(
      { companyId: 'test' },
      { deadline: deadline.getTime() },
      (error: any) => {
        if (error && error.code === grpc.status.NOT_FOUND) {
          // This is fine - server is running, just no company found
          resolve();
        } else if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
    */
    resolve(); // Skip connection test for now
  });
}

/**
 * Closes the gRPC client connection
 */
export function closeGrpcClient(): void {
  if (companyServiceClient) {
    companyServiceClient.close();
    companyServiceClient = null;
    console.log('🔌 gRPC client connection closed');
  }
}

/**
 * Promisify gRPC calls for easier async/await usage
 */
export function promisifyGrpcCall(
  client: any,
  method: string,
  request: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!client[method]) {
      reject(new Error(`Method ${method} not found on client`));
      return;
    }

    client[method](request, (error: any, response: any) => {
      if (error) {
        console.error(`❌ gRPC call ${method} failed:`, error);
        reject(error);
      } else {
        console.log(`✅ gRPC call ${method} successful`);
        resolve(response);
      }
    });
  });
}