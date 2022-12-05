import { useEffect, useState } from "react";
import { DashboardPage } from "../../../components/dashboard-page";
import { FormRow } from "../../../components/form-row";
import { toast } from "../../../components/toast";
import { fetcher } from "../../../helpers/front/fetch";
import type { APIResponseForms } from "../../api/form/all";
import styles from "../../../styles/forms-page.module.css";
import { Button } from "../../../components/button";
import { IoAdd } from "react-icons/io5";
import { clsx } from "clsx";

export default function Page() {

	const [forms, setForms] = useState<APIResponseForms>([]);

	useEffect(() => {
		fetcher<APIResponseForms>({
			path: "/form/all",
			method: 'get'
		})
			.then(setForms)
			.catch(err => {
				console.error(err);
				toast({ status: "error", persist: true, message: "Could not fetch forms." })
			})
	}, []);

	return <DashboardPage title='forms' className={styles.page}>
		<div className={clsx(styles.forms, forms.length > 0 && styles.show)}>
			{forms.map(form => <FormRow form={form} key={form.id} />)}
		</div>
		<Button
			href="/dashboard/forms/new"
			icon={IoAdd}
			className={styles.button}
		/>
	</DashboardPage>
}