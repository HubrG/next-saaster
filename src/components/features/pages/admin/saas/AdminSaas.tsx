"use client";
import { PricingFeatureCategory, appSettings } from "@prisma/client";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { SaasPricing } from './pricing/SaasPricing';

type Props = {
	appSettings: appSettings;
	featureCategories: PricingFeatureCategory[];
};

export const AdminSaas = () => {
	return (
		<>
			<SectionWrapper id="Pricing" sectionName="Pricing">
				<SaasPricing  />
			</SectionWrapper>
		</>
	);
};
