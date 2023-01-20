import { DashboardPage, DashboardPageLoader } from "#components/dashboard-page";
import { useFetch } from "#lib/front/fetch";
import type { APIResponseForm } from "#lib/api/coding";
import { FormView } from "#components/form-view";
import { useEffect, useMemo, useState } from "react";
import styles from "#styles/form-view.module.css";
import { uniqueFormURL } from "#lib/front/form-url";
import { Copier } from "#components/copier";
import { Button } from "#components/button";


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
	const formUrl = useMemo(() => uniqueFormURL(form?.id ?? ''), [form]);

	useEffect(() => {
		setForm(fetchForm);
	}, [fetchForm]);

	return <DashboardPage useMaxWidth title='forms'>
		{form ? <>
			<div className={styles.top}>
				<h1>{form.name}</h1>
				<Button
					value="View Responses"
					href={`/dashboard/responses/${form.id}`}
				/>
			</div>
			<section>
				<h2>Form URL</h2>
				<p>Use the following URL as the action for your forms.</p>
				<Copier value={formUrl} />
			</section>
			<FormView onFormChange={setForm} form={form} title='Edit Form' />
		</> : <DashboardPageLoader />}
	</DashboardPage>
}