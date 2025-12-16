import React from 'react';
import {useFormContext} from 'react-hook-form';
import {FormInput, FormSelect, FormTextarea} from '@/components/FormFields';
import {CompanyInfoFormValues} from '@/lib/schemas';

export const CompanyInfoTab = () => {
    const {register, formState: {errors}} = useFormContext<CompanyInfoFormValues>();

    return (
        <div className="space-y-6">
            <FormInput
                label="Company Name as per MCA"
                required
                {...register('companyName')}
                error={errors.companyName}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput label="Company PAN" required {...register('pan')} error={errors.pan}/>
                <FormInput label="Company GST" required {...register('gst')} error={errors.gst}/>
                <FormInput label="Company TAN" required {...register('tan')} error={errors.tan}/>
            </div>


            <FormInput label="Company Website" required {...register('website')} error={errors.website}
                       placeholder="URL"/>
            <FormInput label="Company Imag Url" required {...register('logo')} error={errors.website}
                       placeholder="URL"/>

            <FormSelect
                label="Company Domain"
                required
                {...register('domain')}
                error={errors.domain}
                options={[
                    {value: '0', label: 'INDUSTRY_UNSPECIFIED'},
                    {value: '1', label: 'TECHNOLOGY'},
                    {value: '2', label: 'FINANCE'},
                    {value: '3', label: 'HEALTHCARE'},
                    {value: '4', label: 'CONSTRUCTION'},
                    {value: '5', label: 'RETAIL'},
                    {value: '6', label: 'MANUFACTURING'},
                    {value: '7', label: 'LOGISTICS'},
                    {value: '-1', label: 'UNRECOGNIZED'},
                ]}
            />

            <FormInput label="Company Strength" required {...register('strength')} error={errors.strength}/>

            <FormTextarea label="Company Description" required {...register('description')} error={errors.description}/>
        </div>
    );
};