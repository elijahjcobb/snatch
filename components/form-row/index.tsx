import Link from "next/link";
import type { APIResponseForm } from "../../helpers/api/coding";
import styles from "./index.module.css";
import { IoOpenOutline } from "react-icons/io5";
import { MouseEvent, useCallback, useMemo } from "react";
import { toast } from "../toast";

export function FormRow({ form }: { form: APIResponseForm }) {

	const uniqueUrl = useMemo(() => `https://snatch.fyi/api/response/${form.id}`, [form.id]);

	const handleCopyToClipboard = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
		ev.stopPropagation();
		ev.preventDefault();
		navigator.clipboard.writeText(uniqueUrl)
			.then(() => toast({ message: "Copied to clipboard" }))
			.catch(() => toast({ message: "Failed to copy clipboard", status: 'error' }));
	}, [uniqueUrl]);

	return <Link href={`/dashboard/forms/${form.id}`} className={styles.form}>
		<div className={styles.left}>
			<span className={styles.name}>{form.name}</span>
			<div>
				<p className={styles.message}>Unique form submission address:</p>
				<button
					onClick={handleCopyToClipboard}
					className={styles.url}
				>{uniqueUrl}</button>
			</div>
		</div>
		<IoOpenOutline className={styles.icon} />
	</Link>
}