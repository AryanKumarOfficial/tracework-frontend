import { z } from 'zod';

// Regex patterns for validation
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const TAN_REGEX = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/; // Added TAN Regex
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_NUM_REGEX = /^\d{9,18}$/; // Usually 9-18 digits

export const companyInfoSchema = z.object({
    companyName: z.string().min(1, 'Company Name is required'),
    pan: z.string().regex(PAN_REGEX, 'Invalid PAN format (e.g., ABCDE1234F)'),
    gst: z.string().regex(GST_REGEX, 'Invalid GST format'),
    tan: z.string().regex(TAN_REGEX, 'Invalid TAN format (e.g., ABCD12345E)'),
    website: z.string().url('Invalid URL format'),
    domain: z.string().min(1, 'Please select a domain'),
    strength: z.string().min(1, 'Company strength is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    logo: z.url('Invalid Url format')
});

export const contactInfoSchema = z.object({
    mobile: z.string().regex(MOBILE_REGEX, 'Invalid Mobile Number'),
    email: z.string().email('Invalid Email Address'),
    address: z.string().min(5, 'Address is too short'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    pinCode: z.string().regex(PINCODE_REGEX, 'Invalid Pin Code'),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const bankingInfoSchema = z.object({
    accountHolderName: z.string().min(1, "Account Holder Name is required"),
    bankName: z.string().min(1, "Bank Name is required"),
    accountNumber: z.string().regex(ACCOUNT_NUM_REGEX, "Invalid Account Number"),
    confirmAccountNumber: z.string().min(1, "Please confirm your account number"),
    ifscCode: z.string().regex(IFSC_REGEX, "Invalid IFSC Code (e.g., SBIN0001234)"),
    accountType: z.string().min(1, "Please select an account type"),
    branchName: z.string().optional(),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Account numbers do not match",
    path: ["confirmAccountNumber"],
});

// Infer TypeScript types from the schema
export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;
export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;
export type BankingInfoFormValues = z.infer<typeof bankingInfoSchema>;