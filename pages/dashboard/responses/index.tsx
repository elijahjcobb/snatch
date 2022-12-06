import { DashboardPage, DashboardPageLoader } from "../../../components/dashboard-page";
import { FormRow } from "../../../components/form-row";
import { useFetch } from "../../../helpers/front/fetch";
import type { APIResponseForms } from "../../api/form/all";
import styles from "../../../styles/forms-page.module.css";

export default function Page() {

	const [forms] = useFetch<APIResponseForms>({
		path: "/form/all",
		method: "get"
	});

	return <DashboardPage useMaxWidth title='responses' className={styles.page}>
		{forms ? <>
			<section>
				<h2>Responses</h2>
				<p>Select a form to view your responses.</p>
			</section>
			<div className={styles.forms}>
				{forms.map(form => <FormRow href={`/dashboard/responses/${form.id}`} form={form} key={form.id} />)}
			</div>
		</> : <DashboardPageLoader />}
	</DashboardPage>
}