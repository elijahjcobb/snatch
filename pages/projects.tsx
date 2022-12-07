import clsx from "clsx";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { BsChevronRight } from "react-icons/bs";
import { DashboardPageLoader } from "../components/dashboard-page";
import { MarketingPage } from "../components/marketing-page";
import { setCookie30Day } from "../helpers/cookie";
import { useFetch } from "../helpers/front/fetch";
import styles from "../styles/projects.module.css";
import { APIResponseUserProject, APIResponseUserProjects } from "./api/user/projects";

export default function ProjectsPage() {

	const [projects] = useFetch<APIResponseUserProjects>({
		path: "/user/projects",
		method: "get",
		scope: "user"
	});

	return <MarketingPage hideHeader title="projects">
		{projects ? <div className={styles.page}>
			<div className={styles.container}>
				<h1>Select a Project</h1>
				<ProjectsTable projects={projects} />
			</div>
		</div> : <DashboardPageLoader />}
	</MarketingPage>
}

export function ProjectsPickerRow({
	data,
	className,
	onClick,
	reload = false
}: {
	data: APIResponseUserProject,
	className?: string
	onClick?: () => void;
	reload?: boolean;
}) {

	const router = useRouter();

	const handleClick = useCallback(() => {
		setCookie30Day('project', data.token);
		setCookie30Day('projectId', data.project.id);
		if (reload) router.reload();
		else router.push("/dashboard");
		if (onClick) onClick();
	}, [data.token, router, data.project.id, onClick, reload]);

	return <button onClick={handleClick} className={clsx(styles.row, className)}>
		<span>{data.project.name}</span>
		<BsChevronRight size={18} />
	</button>
}

function ProjectsTable({ projects }: { projects: APIResponseUserProjects }) {
	return <div className={styles.table}>
		{projects.map(data => <ProjectsPickerRow key={data.project.id} data={data} />)}
	</div>
}