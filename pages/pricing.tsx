import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoCheckmark, IoInformationCircle } from "react-icons/io5";
import { Button } from "#components/button";
import { MarketingPage } from "#components/marketing-page";
import styles from "#styles/pricing.module.css";

type AccountType = 'free' | 'pro' | 'business';
type LineItems = Record<string, {
	plans: Record<AccountType, { value?: string, description?: string, enabled: boolean }>,
	description: string
}>

const LINE_ITEMS: LineItems = {
	'Unlimited Forms': {
		plans: {
			free: { enabled: true, value: "1 Form", description: "You can make one form for free." },
			pro: { enabled: true },
			business: { enabled: true },
		},
		description: "You and your team can make as many forms as your heart desires."
	},
	'Custom Key Indexing': {
		plans: {
			free: { enabled: true },
			pro: { enabled: true },
			business: { enabled: true },
		},
		description: "Only show specific form values in the responses table."
	},
	'Export Responses': {
		plans: {
			free: { enabled: false },
			pro: { enabled: true },
			business: { enabled: true },
		},
		description: "Export all responses as a CSV file."
	},
	'Unlimited Members': {
		plans: {
			free: { enabled: false, description: "To add other members, you need to upgrade from Hobby." },
			pro: { enabled: true },
			business: { enabled: true },
		},
		description: "Add as many members to your project as you would like!"
	},
	'Custom Destination': {
		plans: {
			free: { enabled: false },
			pro: { enabled: true },
			business: { enabled: true },
		},
		description: "Select where your users go after they fill out a form."
	},
	'Unbranded Submission': {
		plans: {
			free: { enabled: false },
			pro: { enabled: false },
			business: { enabled: true },
		},
		description: "Skip the generic snatch submission page and go directly to a custom URL on form completion."
	},
	'Contacts': {
		plans: {
			free: { enabled: false },
			pro: { enabled: false },
			business: { enabled: true },
		},
		description: "Automatically search through your form submissions and view your contact book."
	},
	'Email Notifications': {
		plans: {
			free: { enabled: false },
			pro: { enabled: false },
			business: { enabled: true },
		},
		description: "Receive email notifications when your users fill out your forms."
	},
	'User Notifications': {
		plans: {
			free: { enabled: false },
			pro: { enabled: false },
			business: { enabled: true },
		},
		description: "Automatically email your users on form submission with a custom subject and content."
	},
	'Domain Verification': {
		plans: {
			free: { enabled: false },
			pro: { enabled: false },
			business: { enabled: true },
		},
		description: "Provide a list of acceptable domains to receive form submissions from."
	}
}

function CheckMarkSubtitle({ value }: { value: string }) {
	return <div className={styles.checkMarkSubtitle}>
		<IoCheckmark />
		<span>{value}</span>
	</div>
}

export default function Page() {
	return <MarketingPage title="pricing">
		<div className={styles.container}>
			<h1 className={styles.title}>Store form submissions with Snatch<br />go from static to dynamic.</h1>
			<div className={styles.subtitleContainer}>
				<CheckMarkSubtitle value="Unlimited Responses" />
				<CheckMarkSubtitle value="Add form submission to static sites." />
				<CheckMarkSubtitle value="View all form submissions in one place." />
			</div>
			<div className={styles.pricingCards}>
				<PricingCard
					name="Hobby"
					price={0}
					priceDescription='free, plain and simple'
					isSecondaryButton={false}
					href='/sign-up'
					buttonValue="Sign Up"
					type='free'
				/>
				<PricingCard
					name="Pro"
					price={3}
					priceDescription='per month'
					isSecondaryButton={false}
					href='/sign-up'
					buttonValue="Sign Up"
					type="pro"
				/>
				<PricingCard
					name="Business"
					price={9}
					priceDescription='per month'
					isSecondaryButton={false}
					href='/sign-up'
					buttonValue="Sign Up"
					type="business"
				/>
			</div>
		</div>
	</MarketingPage>
}

interface LineItem {
	value: string,
	enabled: boolean,
	description: string
}

function PricingCardLineItem({
	value,
	enabled,
	description
}: LineItem) {

	const [pos, setPos] = useState<[number, number]>([0, 0]);
	const [showTooltip, setShowTooltip] = useState(false);
	const parent = useRef<HTMLDivElement>(null);
	const tooltip = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!parent.current) return;
		if (!tooltip.current) return;
		const x = parent.current.offsetLeft;
		let y = parent.current.offsetTop;
		y -= tooltip.current.clientHeight + 8;
		setPos([x, y]);
	}, []);

	return <div ref={parent} className={clsx(styles.lineItem, !enabled && styles.na)}>
		<span>{value}</span>
		<IoInformationCircle
			onClick={() => setShowTooltip(true)}
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
			className={styles.info} />
		<span
			ref={tooltip}
			style={{ left: pos[0], top: pos[1] }}
			onClick={() => setShowTooltip(false)}
			className={clsx(styles.tooltip, showTooltip && styles.showTooltip)}
		>{description}</span>
	</div>
}


function PricingCard({
	price,
	priceDescription,
	name,
	isSecondaryButton,
	href,
	buttonValue,
	type
}: {
	price: number;
	priceDescription: string;
	name: string;
	isSecondaryButton: boolean;
	href: string;
	buttonValue: string;
	type: AccountType;
}) {

	const items = useMemo<LineItem[]>(() => {
		const i: LineItem[] = [];
		for (const [featureName, feature] of Object.entries(LINE_ITEMS)) {
			const plan = feature.plans[type];
			const value = plan.value ?? featureName;
			const enabled = plan.enabled;
			const description = plan.description ?? feature.description;
			i.push({ value, enabled, description });
		}
		return i;
	}, [type]);

	return <div className={styles.pricingCard}>
		<span className={styles.name}>{name}</span>
		<span className={styles.price}>{`$${price}`}</span>
		<span className={styles.priceDescription}>{priceDescription}</span>
		<Button
			value={buttonValue}
			href={href}
			className={styles.cta}
			secondary={isSecondaryButton}
		/>
		<div className={styles.line} />
		<div className={styles.items}>
			{items.map(v => <PricingCardLineItem key={v.value} {...v} />)}
		</div>
	</div>
}