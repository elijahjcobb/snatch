import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingPage } from "../marketing-page";
import styles from "./index.module.css";

interface Page {
	name: string;
	href: string;
}

type Content = (Page | Section)[];

interface Section {
	section: string;
	href?: string;
	content: Content;
}

type Sections = Content;

const SECTIONS: Sections = [
	{
		name: "Get Started",
		href: "get-started"
	},
	{
		section: "Dashboard",
		content: [
			{
				name: "Invite Members",
				href: "dashboard/invite-members"
			},
			{
				name: "Upgrade Project",
				href: "dashboard/upgrade-project"
			},
		]
	},
	{
		section: "Forms",
		content: [
			{
				name: "Create a Form",
				href: "forms/create-a-form"
			},
			{
				section: "Attributes",
				content: [

					{
						name: "Keys",
						href: "forms/attributes/keys"
					},
					{
						name: "Destination",
						href: "forms/attributes/destination"
					},
					{
						name: "Domains",
						href: "forms/attributes/domains"
					},
					{
						name: "Email Notifications",
						href: "forms/attributes/email-notifications"
					},
				]
			},
		]
	},
	{
		section: "Responses",
		content: [
			{
				name: "View",
				href: 'responses/view',
			},
			{
				name: "Export",
				href: 'responses/export',
			},
		]
	},
	{
		section: "Submission",
		content: [
			{
				name: "Set up HTML Form",
				href: "submission/set-up-html-form"
			},
			{
				name: "Testing Submission",
				href: "submission/testing"
			},
		]
	}
]

function LinkComponent({ href, value }: { href: string, value: string }) {
	return <Link className={styles.link} href={`/docs/${href}`}>
		{value}
	</Link>
}

function PageComponent({ page }: { page: Page }) {
	return <li><LinkComponent href={page.href} value={page.name} /></li>
}

function SectionComponent({ section }: { section: Section }) {
	return <li key={section.section}>
		<div>
			{section.href
				? <LinkComponent href={section.href} value={section.section} />
				: <span className={styles.sectionTitle}>{section.section}</span>}
			<ul>
				{section.content.map(content => <PageSection key={content.href} content={content} />)}
			</ul>
		</div>
	</li>
}

function PageSection({ content }: { content: Page | Section }) {
	if (Object.hasOwn(content, 'section')) {
		const section = content as Section;
		return <SectionComponent key={section.section} section={section} />
	} else {
		const page = content as Page;
		return <PageComponent key={page.name} page={page} />
	}
}

export function DocsPage({
	children
}: {
	children: ReactNode;
}) {
	return <MarketingPage hideFooter>
		<div className={styles.page}>
			<div className={styles.nav}>
				<ul>
					{SECTIONS.map(content => <PageSection key={content.href} content={content} />)}
				</ul>
			</div>
			<div className={styles.md}>
				{children}
			</div>
		</div>
	</MarketingPage>
}