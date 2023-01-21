
import styles from "../index.module.css";
import Link from "next/link";
import { Copier } from "#components/copier";
import { useDashboardContext } from "lib/front/dashboard-context";
import { Skeleton, SkeletonContainer } from "#components/skeleton";
import project from "#api/project";
import { APIResponseUser } from "#api/user";
import { useFetch } from "lib/front/fetch";
import { APIResponseProject } from "lib/api/coding";

export function SettingsProjectPlan() {

	const [project] = useFetch<APIResponseProject>({
		path: "/project",
		method: "get",
		scope: "project"
	});

	console.log(project);

	return <section>
		<h3>Plan</h3>
		<p>Change your project&apos;s plan. See <Link target='_blank' href='/pricing'>pricing</Link>.</p>
		{project ? <Copier value={project.plan} /> : <Skeleton height={36} />}
	</section>
}