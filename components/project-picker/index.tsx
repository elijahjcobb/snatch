import { getCookie } from "cookies-next";
import { useMemo, useState } from "react";
import { APIResponseProject } from "../../helpers/api/coding";
import { useFetch } from "../../helpers/front/fetch"
import { APIResponseUserProjects } from "../../pages/api/user/projects"
import { IoChevronUpCircle, IoAdd } from "react-icons/io5";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import clsx from "clsx";
import { BaseProjectsPickerRow, ProjectsPickerRow } from "../../pages/projects";

export function ProjectPicker() {

	const router = useRouter();

	const [showOverlay, setShowOverlay] = useState(false);

	const [data] = useFetch<APIResponseUserProjects>({
		path: "/user/projects",
		method: "get",
		scope: "user"
	});

	const currentTeam = useMemo<APIResponseProject | undefined>(() => {
		if (!data) return undefined;
		const projectId = getCookie("projectId");
		if (!projectId) return undefined;
		for (const d of data) {
			if (d.project.id === projectId) {
				return d.project;
			}
		}
		router.push("/projects");
	}, [data, router]);

	return <div className={styles.container}>
		{data ? <div className={clsx(styles.overlay, showOverlay && styles.show)}>
			<BaseProjectsPickerRow
				value="Create Project"
				className={styles.create}
				icon={IoAdd}
				onClick={() => router.push("/projects/create")}
			/>
			{data.map(d => <ProjectsPickerRow
				onClick={() => setShowOverlay(false)}
				className={styles.row}
				key={d.project.id}
				reload
				data={d} />)}
		</div> : null}
		<button
			onClick={() => setShowOverlay(v => !v)}
			className={styles.picker}>
			{currentTeam ? <>
				<span>{currentTeam?.name}</span>
				<IoChevronUpCircle className={clsx(styles.icon, showOverlay && styles.iconFlip)} />
			</> : null}
		</button>
	</div>
}