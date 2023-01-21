
import styles from "../index.module.css";
import Link from "next/link";
import { Copier } from "#components/copier";
import { useDashboardContext } from "#lib/front/dashboard-context";

export function SettingsProjectPlan() {

	const { project } = useDashboardContext();

	console.log({ project })

	return <section>
		<h3>Plan</h3>
		<p>Change your project&apos;s plan. See <Link target='_blank' href='/pricing'>pricing</Link>.</p>
		<div className={styles.flex}>
			<Copier value={project?.id} />
		</div>
	</section>
}