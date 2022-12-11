import Link from "next/link";
import { ReactNode, useCallback, useMemo } from "react";
import { IconType } from "react-icons/lib";
import { BasePage } from "../base-page";
import { Icon } from "../icon";
import styles from "./index.module.css";
import { IoStorefront, IoRocket, IoSettings, IoPersonCircle, IoReceipt } from "react-icons/io5";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Button } from "../button";
import { deleteCookie } from "cookies-next";
import { ImSpinner } from "react-icons/im";
import { ProjectPicker } from "../project-picker";
import { DashboardProvider } from "../../helpers/front/dashboard-context";

function DashboardLink({
	href,
	icon: Icon,
	name
}: {
	href: string;
	icon: IconType;
	name: string;
}) {

	const router = useRouter();
	const isActive = useMemo(() => {
		if (href === '/dashboard') return href === router.pathname;
		return router.pathname.startsWith(href)
	}, [router, href]);

	return <Link className={clsx(styles.dashboardLink, isActive && styles.dashboardLinkActive)} href={href} >
		<Icon className={styles.dashboardLinkIcon} />
		<span>{name}</span>
	</Link>
}

export function DashboardPage({
	title,
	children,
	className,
	useMaxWidth = false,
	maxWidth = 720
}: {
	title?: string;
	children: ReactNode;
	className?: string;
	useMaxWidth?: boolean;
	maxWidth?: number;
}) {

	const router = useRouter();

	const handleSignOut = useCallback(() => {
		deleteCookie("user");
		deleteCookie("project");
		deleteCookie("projectId");
		router.push("/sign-in");
	}, [router]);

	return <DashboardProvider>
		<BasePage title={title}>
			<div className={styles.page}>
				<header className={styles.header}>
					<Link href='/about' className={styles.title}>
						<Icon size={32} />
						<h1>snatch</h1>
					</Link>
					<nav className={styles.nav}>
						<DashboardLink
							href='/dashboard'
							name="Dashboard"
							icon={IoStorefront}
						/>
						<DashboardLink
							href='/dashboard/forms'
							name="Forms"
							icon={IoRocket}
						/>
						<DashboardLink
							href='/dashboard/responses'
							name="Responses"
							icon={IoReceipt}
						/>
						<DashboardLink
							href='/dashboard/contacts'
							name="Contacts"
							icon={IoPersonCircle}
						/>
						<DashboardLink
							href='/dashboard/settings'
							name="Settings"
							icon={IoSettings}
						/>
					</nav>
					<ProjectPicker />
					<div className={styles.buttons}>
						<Button
							secondary
							value="Sign Out"
							onClick={handleSignOut}
						/>
						<Button
							href="/docs"
							newTab
							value="Docs"
						/>
					</div>
				</header>
				<div className={clsx(styles.childContainer)}>
					<div style={{
						maxWidth: useMaxWidth ? maxWidth : 'unset',
						padding: useMaxWidth ? 'var(--sp-6) 0' : 0,
					}} className={clsx(styles.child, className)}>
						{children}
					</div>
				</div>
			</div>
		</BasePage>
	</DashboardProvider>
}

export function DashboardPageLoader() {
	return <div className={styles.spinnerContainer}>
		<ImSpinner className={styles.spinner} />
	</div>
}