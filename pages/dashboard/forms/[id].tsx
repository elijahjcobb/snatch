import { DashboardPage, DashboardPageLoader } from "../../../components/dashboard-page";
import { useFetch } from "../../../helpers/front/fetch";
import type { APIResponseForm } from "../../../helpers/api/coding";
import { FormView } from "../../../components/form-view";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "../../../components/toast";
import styles from "../../../styles/form-view.module.css";


export default function Page() {

	const [fetchForm] = useFetch<APIResponseForm>(() => {
		const path = document.location.pathname;
		const segments = path.split("/");
		const id = segments[segments.length - 1];
		return {
			path: `/form/${id}`,
			method: "get",
		}
	});

	const [form, setForm] = useState<APIResponseForm | undefined>(undefined);

	const formUrl = useMemo(() => `https://snatch.fyi/api/response/${form?.id}`, [form]);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(formUrl)
			.then(() => toast({ message: "Copied to clipboard" }))
			.catch(() => toast({ message: "Failed to copy to clipboard", status: "error" }))
	}, [formUrl]);

	useEffect(() => {
		setForm(fetchForm);
	}, [fetchForm]);

	return <DashboardPage useDefaultMaxWidth title='forms'>
		{form ? <>
			<h1>{form.name}</h1>
			<section>
				<h3>Form URL</h3>
				<p>Use the following URL as the action for your forms.</p>
				<button onClick={handleCopy} className={styles.url}>{formUrl}</button>
			</section>
			<h2>Stats</h2>
			<FormView onFormChange={setForm} form={form} title='Update Form' />
		</> : <DashboardPageLoader />}
	</DashboardPage>
}