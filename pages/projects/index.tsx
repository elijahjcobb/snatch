import clsx from "clsx";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { IconType } from "react-icons";
import { BsChevronRight } from "react-icons/bs";
import { Button } from "../../components/button";
import { DashboardPageLoader } from "../../components/dashboard-page";
import { MarketingPage } from "../../components/marketing-page";
import { setCookie30Day } from "../../helpers/cookie";
import { useFetch } from "../../helpers/front/fetch";
import styles from "../../styles/projects.module.css";
import { APIResponseUserProject, APIResponseUserProjects } from "../api/user/projects";

export default function ProjectsPage() {

	const [projects] = useFetch<APIResponseUserProjects>({
		path: "/user/projects",
		method: "get",
		scope: "user"
	});

	return <MarketingPage hideHeader title="projects">
		{projects ? <div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.top}>
					<h1>Select a Project</h1>
					<Button
						secondary
						href="/projects/create"
						value="Create"
					/>
				</div>
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

	return <BaseProjectsPickerRow
		icon={BsChevronRight}
		value={data.project.name}
		onClick={handleClick}
		className={className}
	/>
}

export function BaseProjectsPickerRow({
	icon: Icon,
	value,
	onClick,
	className
}: {
	icon: IconType,
	value: string,
	onClick?: () => void,
	className?: string
}) {
	return <button onClick={onClick} className={clsx(styles.row, className)}>
		<span>{value}</span>
		<Icon size={18} />
	</button>
}

function ProjectsTable({ projects }: { projects: APIResponseUserProjects }) {
	return <div className={styles.table}>
		{projects.map(data => <ProjectsPickerRow key={data.project.id} data={data} />)}
	</div>
}