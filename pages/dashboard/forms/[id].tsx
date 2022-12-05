import { useEffect, useState } from "react";
import { DashboardPage } from "../../../components/dashboard-page";
import { FormRow } from "../../../components/form-row";
import { toast } from "../../../components/toast";
import { fetcher } from "../../../helpers/front/fetch";
import type { APIResponseForm } from "../../../helpers/api/coding";
import { FormView } from "../../../components/form-view";

export default function Page() {

	const [form, setForm] = useState<APIResponseForm | undefined>(undefined);

	useEffect(() => {
		const path = document.location.pathname;
		const segments = path.split("/");
		const id = segments[segments.length - 1];
		fetcher<APIResponseForm>({
			path: `/form/${id}`,
			method: "get",
		})
			.then(setForm)
			.catch(() => toast({ message: "Could not fetch form.", status: "error" }))
	}, []);

	return <DashboardPage title='forms'>
		{form ? <FormView form={form} /> : null}
	</DashboardPage>
}