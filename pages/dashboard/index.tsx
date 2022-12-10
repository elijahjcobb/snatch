import { IoPerson, IoReceipt } from "react-icons/io5";
import { DashboardPage, DashboardPageLoader } from "../../components/dashboard-page";
import { StatCard } from "../../components/stat-card";
import { useFetch } from "../../helpers/front/fetch";
import { APIResponseDashboard } from "../api/project/dashboard";
import styles from "../../styles/dashboard.module.css";

export default function Page() {

	const [data] = useFetch<APIResponseDashboard>({
		path: "/project/dashboard",
		method: 'get'
	});

	return <DashboardPage useMaxWidth title='dashboard'>
		{data ? <div>
			<h2>Dashboard</h2>
			<div className={styles.cards}>
				<StatCard
					name="Entries"
					icon={IoReceipt}
					count={data.entries}
					href='/dashboard/responses'
				/>
				<StatCard
					name="Contacts"
					icon={IoPerson}
					count={data.contacts}
					href='/dashboard/contacts'
				/>
			</div>
		</div> : <DashboardPageLoader />}
	</DashboardPage>
}