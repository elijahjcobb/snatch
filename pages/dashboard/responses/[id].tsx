import { DashboardPage, DashboardPageLoader } from "../../../components/dashboard-page";
import { useFetch } from "../../../helpers/front/fetch";
import type { APIResponseFormEntries } from "../../../helpers/api/coding";
import styles from "../../../styles/responses-view.module.css";
import { Button } from "../../../components/button";
import { EntriesTable } from "../../../components/entries-table";

export default function Page() {

	const [data] = useFetch<APIResponseFormEntries>(() => {
		const path = document.location.pathname;
		const segments = path.split("/");
		const id = segments[segments.length - 1];
		return {
			path: `/form/${id}/entries`,
			method: "get",
		}
	});

	return <DashboardPage className={styles.page} title='responses'>
		{data ? <>
			<div className={styles.top}>
				<h1>{data.form.name}</h1>
				<Button
					secondary
					value="Export"
				/>
				<Button
					value="View Form"
					href={`/dashboard/forms/${data.form.id}`}
				/>
			</div>
			<EntriesTable form={data.form} entries={data.responses} />
		</> : <DashboardPageLoader />}
	</DashboardPage>
}