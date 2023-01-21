import { useCallback, useState } from "react";
import { APIResponseForm } from "lib/api/coding";
import { Field } from "../field";
import styles from "./index.module.css";
import { IoPencil, IoLink, IoEarth, IoKey } from "react-icons/io5";
import { Button } from "../button";
import { IoAdd, IoTrash, IoSave } from "react-icons/io5";
import { fetcher } from "lib/front/fetch";
import { useRouter } from "next/router";
import { HOST } from "lib/constants";
import { Toggle } from "../toggle";
import { IoPeople, IoPerson } from "react-icons/io5";

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
	const [keys, setKeys] = useState(form?.keys.join(",") ?? "");
	const [notifyAdmin, setNotifyAdmin] = useState(form?.notifyAdmin ?? false);
	const [notifyResponder, setNotifyResponder] = useState(form?.notifyResponder ?? false);
	const [loading, setLoading] = useState(false);

	const handleDelete = useCallback(() => {
		if (!form?.id) return;
		setLoading(true);
		fetcher<APIResponseForm>({
			path: `/form/${form.id}`,
			method: 'delete',
			message: 'Deleting form...'
		}).then(() => {
			router.push("/dashboard/forms");
		}).finally(() => setLoading(false));
	}, [form, router]);

	const handleSubmit = useCallback(() => {
		setLoading(true);

		const body = {
			notifyAdmin,
			notifyResponder
		};

		function addIfLengthValid(key: string, value: { length: number }): void {
			// @ts-expect-error
			if (value.length > 0) body[key] = value;
		}

		addIfLengthValid('name', name.trim());
		addIfLengthValid('destination', destination.trim());

		let formattedDomains = domains.split(",");
		formattedDomains.forEach(v => v.trim());
		if (formattedDomains[0].length === 0) formattedDomains = [];
		addIfLengthValid('domains', formattedDomains);

		let formattedKeys = keys.split(",");
		formattedKeys.forEach(v => v.trim());
		if (formattedKeys[0].length === 0) formattedKeys = [];
		addIfLengthValid('keys', formattedKeys);

		fetcher<APIResponseForm>({
			path: `/form/${form ? form.id : ""}`,
			method: form ? 'put' : "post",
			body,
			message: 'Saving form...'
		}).then((res) => {
			if (onFormChange) {
				onFormChange(res);
			} else router.push(`/dashboard/forms/${res.id}`);
		}).catch(console.error).finally(() => setLoading(false))
	}, [form, name, keys, destination, domains, onFormChange, router, notifyAdmin, notifyResponder]);

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
			<h3>Keys</h3>
			<p>A comma separated list (with no spaces) of the keys we should index on. If none are provided, all keys from responses will be used to index your data.</p>
			<Field
				value={keys}
				icon={IoKey}
				onChange={setKeys}
				disabled={loading}
				label='keys'
				mono
				placeholder={`firstName,lastName,email`} />
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
				placeholder={`${HOST}/submission/success`} />
		</section>
		<section>
			<h3>Domains</h3>
			<p>Which domains can your forms be filled out on? Provide a comma separated list. <b>Note:</b> Leave empty to allow all domains.</p>
			<Field
				value={domains}
				icon={IoEarth}
				disabled={loading}
				onChange={setDomains}
				mono
				placeholder='my-site.com,my-other-site.com'
				label="domains" />
		</section>
		<section>
			<h3>Email Notifications</h3>
			<p>Who should be notified when a responder provides a form entry?</p>
			<div className={styles.toggles}>
				<Toggle
					value={notifyAdmin}
					onChange={setNotifyAdmin}
					label='Team'
					icon={IoPeople}
					disabled={loading}
				/>
				<Toggle
					value={notifyResponder}
					onChange={setNotifyResponder}
					label='Responder'
					icon={IoPerson}
					disabled={loading}
				/>
			</div>
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
