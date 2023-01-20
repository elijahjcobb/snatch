import { IoPerson, IoReceipt } from "react-icons/io5";
import { DashboardPage } from "#components/dashboard-page";
import { StatCard } from "#components/stat-card";
import { useFetch } from "#lib/front/fetch";
import { APIResponseDashboard } from "#api/project/dashboard";
import styles from "#styles/dashboard.module.css";
import { SkeletonContainer } from "#components/skeleton";

export default function Page() {

	const [data] = useFetch<APIResponseDashboard>({
		path: "/project/dashboard",
		method: 'get'
	});

	return <DashboardPage useMaxWidth title='dashboard'>
		<h2>Dashboard</h2>
		<div className={styles.cards}>
			<SkeletonContainer height={283} hasLoaded={Boolean(data)}>
				<StatCard
					name="Entries"
					icon={IoReceipt}
					count={data?.entries ?? 0}
					href='/dashboard/responses'
				/>
			</SkeletonContainer>
			<SkeletonContainer height={283} hasLoaded={Boolean(data)}>
				<StatCard
					name="Contacts"
					icon={IoPerson}
					count={data?.contacts ?? 0}
					href='/dashboard/contacts'
				/>
			</SkeletonContainer>
		</div>
	</DashboardPage>
}