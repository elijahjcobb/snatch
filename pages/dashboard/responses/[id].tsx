import { DashboardPage, DashboardPageLoader } from "#components/dashboard-page";
import { useFetch } from "lib/front/fetch";
import type { APIResponseFormEntries } from "lib/api/coding";
import styles from "#styles/responses-view.module.css";
import { Button } from "#components/button";
import { EntriesTable } from "#components/entries-table";
import { useProject } from "#lib/front/dashboard-context";
import { fetchPlan } from "#lib/plan";

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

	const project = useProject();

	return <DashboardPage className={styles.page} title='responses'>
		{data ? <>
			<div className={styles.top}>
				<h1>{data.form.name}</h1>
				{project && fetchPlan(project).exportResponses ? <Button
					secondary
					value="Export"
					newTab
					href={`/api/form/${data.form.id}/export`}
				/> : null}
				<Button
					value="View Form"
					href={`/dashboard/forms/${data.form.id}`}
				/>
			</div>
			<EntriesTable form={data.form} entries={data.responses} />
		</> : <DashboardPageLoader />}
	</DashboardPage>
}