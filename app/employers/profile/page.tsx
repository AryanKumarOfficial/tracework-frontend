"use client";
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { useAppSelector } from '@/lib/hooks'; // Ensure you have this hook or use useSelector directly
import {
    companyInfoSchema,
    contactInfoSchema,
    bankingInfoSchema,
    CompanyInfoFormValues,
    ContactInfoFormValues,
    BankingInfoFormValues
} from '@/lib/schemas';
import { CompanyInfoTab } from '@/components/tabs/CompanyInfoTab';
import { ContactInfoTab } from '@/components/tabs/ContactInfoTab';
import { BankingInfoTab } from "@/components/tabs/BankingInfoTab";

type FormValues = Partial<CompanyInfoFormValues> & Partial<ContactInfoFormValues> & Partial<BankingInfoFormValues>;

export default function MyProfile() {
    const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'banking'>('company');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get company ID from Redux state
    const { company } = useAppSelector((state) => state.auth);
    const dispatch = useDispatch();

    const currentSchema =
        activeTab === 'company' ? companyInfoSchema :
            activeTab === 'contact' ? contactInfoSchema :
                bankingInfoSchema;

    const methods = useForm<FormValues>({
        // @ts-expect-error - Dynamic resolver type issue
        resolver: zodResolver(currentSchema),
        mode: 'onBlur',
        shouldUnregister: false,
    });

    // 1. Fetch Profile Data on Mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/companies/me', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });
                const result = await res.json();
                console.log(`Fetched profile: ${JSON.stringify(result, null, 2)}`)
                if (result.success && result.data) {
                    const {company, contact, banking} = result.data;

                    dispatch(setCredentials({company}));

                    methods.reset({
                        // Company Info
                        companyName: company.company_name, // Ensure casing matches API response
                        email: company.email,
                        description: company.description,
                        website: company.websiteUrl,
                        pan: company.pan,
                        gst: company.gst,
                        tan: company.tan,
                        strength: company.strength?.toString(),

                        // Contact Info
                        mobile: company.phone,
                        address: company.address,
                        state: contact?.state,
                        city: contact?.city,
                        pinCode: contact?.pinCode,
                        linkedin: contact?.linkedin,
                        instagram: contact?.instagram,
                        twitter: contact?.twitter,

                        // Banking Info
                        accountHolderName: banking?.accountHolderName,
                        accountNumber: banking?.accountNumber,
                        bankName: banking?.bankName,
                        branchName: banking?.branchName,
                        ifscCode: banking?.ifscCode,
                        accountType: 'savings', // Default or fetch if available
                        confirmAccountNumber: banking?.accountNumber
                    });
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [dispatch, methods]);

    const onSubmit = async (data: FormValues) => {
        if (!company?.id) {
            alert("Session expired. Please login again.");
            return;
        }

        setIsSubmitting(true);
        try {
            let payload: any = {};
            let updateType = '';

            // Construct payload based on active tab
            if (activeTab === 'company') {
                updateType = 'general';
                payload = {
                    id: company.id,
                    companyName: data.companyName,
                    email: data.email,
                    description: data.description,
                    websiteUrl: data.website,
                    // Send metadata as a separate object for the backend to handle
                    metadata: {
                        pan: data.pan,
                        gst: data.gst,
                        tan: data.tan,
                        strength: Number(data.strength),
                    }
                };
            } else if (activeTab === 'contact') {
                updateType = 'contact';
                payload = {
                    companyId: company.id,
                    // Fields for Company Entity
                    email: data.email,
                    phone: data.mobile,
                    address: data.address,
                    // Fields for CompanyContact Entity
                    state: data.state,
                    city: data.city,
                    pinCode: data.pinCode,
                    linkedin: data.linkedin,
                    instagram: data.instagram,
                    twitter: data.twitter,
                };
            } else if (activeTab === 'banking') {
                updateType = 'banking';
                payload = {
                    companyId: company.id,
                    accountHolderName: data.accountHolderName,
                    accountNumber: data.accountNumber,
                    bankName: data.bankName,
                    branchName: data.branchName,
                    ifscCode: data.ifscCode,
                };
            }

            const res = await fetch(`/api/companies/update?type=${updateType}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message || 'Update failed');

            alert(`${tabs.find(t => t.id === activeTab)?.label} updated successfully!`);

        } catch (error: any) {
            console.error('Update failed:', error);
            alert(error.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const tabs = [
        {id: 'company', label: 'Company Information'},
        {id: 'contact', label: 'Contact Information'},
        {id: 'banking', label: 'Banking Information'},
    ] as const;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-24">
                        <div className="border-b border-gray-200 px-6 pt-4">
                            <nav className="-mb-px flex space-x-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                            ${activeTab === tab.id
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                        `}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 md:p-8">
                            {activeTab === 'company' && <CompanyInfoTab/>}
                            {activeTab === 'contact' && <ContactInfoTab/>}
                            {activeTab === 'banking' && <BankingInfoTab/>}
                        </div>
                    </div>

                    <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 flex justify-end items-center gap-4 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                            onClick={() => methods.reset()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-[#0a1128] text-white rounded-lg hover:bg-[#1a2340] font-medium text-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            Save
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}