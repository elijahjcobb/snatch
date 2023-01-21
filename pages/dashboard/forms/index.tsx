import { DashboardPage, DashboardPageLoader } from "#components/dashboard-page";
import { FormRow } from "#components/form-row";
import { useFetch } from "lib/front/fetch";
import type { APIResponseForms } from "#api/form/all";
import styles from "#styles/forms-page.module.css";
import { Button } from "#components/button";
import { IoAdd } from "react-icons/io5";

export default function Page() {

	const [forms] = useFetch<APIResponseForms>({
		path: "/form/all",
		method: "get"
	});

	return <DashboardPage useMaxWidth title='forms' className={styles.page}>
		{forms ? <>
			<section>
				<h2>Forms</h2>
				<p>Edit or create your forms.</p>
			</section>
			<div className={styles.forms}>
				{forms.map(form => <FormRow href={`/dashboard/forms/${form.id}`} form={form} key={form.id} />)}
			</div>
			<Button
				href="/dashboard/forms/new"
				icon={IoAdd}
				className={styles.button}
			/>
		</> : <DashboardPageLoader />}
	</DashboardPage>
}