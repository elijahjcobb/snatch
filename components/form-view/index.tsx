import { useCallback, useMemo, useState } from "react";
import { APIResponseForm } from "../../helpers/api/coding";
import { Field } from "../field";
import styles from "./index.module.css";
import { IoPencil, IoLink, IoEarth } from "react-icons/io5";
import { Button } from "../button";
import { IoAdd, IoSave } from "react-icons/io5";
import { fetcher } from "../../helpers/front/fetch";
import { toast } from "../toast";
import { APIError } from "../../helpers/api-error";
import { useRouter } from "next/router";

export function FormView({ form }: { form?: APIResponseForm }) {

	const router = useRouter();
	const [name, setName] = useState(form?.name ?? "");
	const [destination, setDestination] = useState(form?.destination ?? "");
	const [domains, setDomains] = useState(form?.domains.join(",") ?? "");
	const [loading, setLoading] = useState(false);
	const formUrl = useMemo(() => `https://snatch.fyi/api/response/${form?.id}`, [form]);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(formUrl)
			.then(() => toast({ message: "Copied to clipboard" }))
			.catch(() => toast({ message: "Failed to copy to clipboard", status: "error" }))
	}, [formUrl]);

	const handleSubmit = useCallback(() => {
		setLoading(true);
		fetcher({
			path: `/form/${form ? form.id : ""}`,
			method: form ? 'put' : "post",
			body: {
				name: name.trim(),
				destination: destination.trim().length > 0 ? destination.trim() : undefined,
				domains: domains.split(","),
				notifyAdmin: true,
				notifyResponder: false,
			}
		}).then(() => {
			router.push("/dashboard/forms");
		}).catch((err) => {
			let message = "Could not save form.";
			if (err instanceof APIError) message = err.message
			toast({ status: "error", message })
		}).finally(() => setLoading(false))
	}, [form, name, destination, domains, router]);

	return <div className={styles.page}>
		<h2>{form ? "Update" : "Create"} Form</h2>
		{form ? <div>
			<p>Use the following URL for your form:</p>
			<button onClick={handleCopy} className={styles.url}>{formUrl}</button>
		</div> : null}
		<Field
			value={name}
			showLabel
			disabled={loading}
			icon={IoPencil}
			onChange={setName}
			placeholder='A form hosted on snatch'
			label="name" />
		<Field
			value={destination}
			icon={IoLink}
			showLabel
			onChange={setDestination}
			disabled={loading}
			label='destination'
			mono
			placeholder="https://my-site.com/form/submitted" />
		<Field
			value={domains}
			icon={IoEarth}
			showLabel
			disabled={loading}
			onChange={setDomains}
			mono
			placeholder='my-site.com,my-other-site.com'
			label="domains" />
		<Button
			disabled={loading}
			icon={form ? IoSave : IoAdd}
			onClick={handleSubmit}
			value={form ? "Update" : "Create"} />
	</div>
}
