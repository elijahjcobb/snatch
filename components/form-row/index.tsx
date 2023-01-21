import Link from "next/link";
import type { APIResponseForm } from "lib/api/coding";
import styles from "./index.module.css";
import { IoOpenOutline } from "react-icons/io5";

export function FormRow({
	form,
	href
}: {
	form: APIResponseForm,
	href: string;
}) {
	return <Link href={href} className={styles.form}>
		<div className={styles.left}>
			<span className={styles.name}>{form.name}</span>
		</div>
		<IoOpenOutline className={styles.icon} />
	</Link>
}