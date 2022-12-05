import Link from "next/link";
import type { APIResponseForm } from "../../helpers/api/coding";
import styles from "./index.module.css";
import { IoOpenOutline } from "react-icons/io5";

export function FormRow({ form }: { form: APIResponseForm }) {


	return <Link href={`/dashboard/forms/${form.id}`} className={styles.form}>
		<div className={styles.left}>
			<span className={styles.name}>{form.name}</span>
		</div>
		<IoOpenOutline className={styles.icon} />
	</Link>
}