import { useCallback, useMemo, useState } from "react";
import { APIResponseForm } from "../../helpers/api/coding";
import { Field } from "../field";
import styles from "./index.module.css";
import { IoPencil, IoLink, IoEarth } from "react-icons/io5";
import { Button } from "../button";
import { IoAdd, IoTrash, IoSave } from "react-icons/io5";
import { fetcher } from "../../helpers/front/fetch";
import { toast } from "../toast";
import { APIError } from "../../helpers/api-error";
import { useRouter } from "next/router";

export function FormView({
	form,
	title,
	onFormChange
}: {
	form?: APIResponseForm,
	title?: string,
	onFormChange?: (form: APIResponseForm) => void;
}) {

	const router = useRouter();
	const [name, setName] = useState(form?.name ?? "");
	const [destination, setDestination] = useState(form?.destination ?? "");
	const [domains, setDomains] = useState(form?.domains.join(",") ?? "");
	const [loading, setLoading] = useState(false);

	const handleDelete = useCallback(() => {
		if (!form?.id) return;
		fetcher<APIResponseForm>({
			path: `/form/${form.id}`,
			method: 'delete',
			message: 'Deleting form...'
		}).then(() => {
			router.push("/dashboard/forms");
		}).catch(console.error)
	}, [form, router]);

	const handleSubmit = useCallback(() => {
		setLoading(true);
		fetcher<APIResponseForm>({
			path: `/form/${form ? form.id : ""}`,
			method: form ? 'put' : "post",
			body: {
				name: name.trim(),
				destination: destination.trim().length > 0 ? destination.trim() : undefined,
				domains: domains.split(","),
				notifyAdmin: true,
				notifyResponder: false,
			},
			message: 'Saving form...'
		}).then((res) => {
			if (onFormChange) onFormChange(res);
			else router.push("/dashboard/forms");
		}).catch(console.error).finally(() => setLoading(false))
	}, [form, name, destination, domains, onFormChange, router]);

	return <div className={styles.page}>
		{title ? <h2>{title}</h2> : null}
		<section>
			<h3>Name</h3>
			<p>The name of your form. Only you will see this name.</p>
			<Field
				value={name}
				disabled={loading}
				icon={IoPencil}
				onChange={setName}
				placeholder='A form hosted on snatch'
				label="name" />
		</section>
		<section>
			<h3>Destination</h3>
			<p>Where should your users be redirected to once they fill out your form?</p>
			<Field
				value={destination}
				icon={IoLink}
				onChange={setDestination}
				disabled={loading}
				label='destination'
				mono
				placeholder="https://my-site.com/form/submitted" />
		</section>
		<section>
			<h3>Domains</h3>
			<p>Which domains can your forms be filled out on? <b>Note:</b> Leave empty to allow all domains.</p>
			<Field
				value={domains}
				icon={IoEarth}
				showLabel
				disabled={loading}
				onChange={setDomains}
				mono
				placeholder='my-site.com,my-other-site.com'
				label="domains" />
		</section>
		<div className={styles.buttons}>
			{form ? <Button
				disabled={loading}
				icon={IoTrash}
				onClick={handleDelete}
				secondary
				value={"Delete"} /> : null}
			<Button
				disabled={loading}
				className={styles.saveButton}
				icon={form ? IoSave : IoAdd}
				onClick={handleSubmit}
				value={form ? "Save" : "Create"} />
		</div>
	</div>
}
