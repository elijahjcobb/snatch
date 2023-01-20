import { useCallback, useEffect, useState } from "react";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { APIResponseProject } from "#lib/api/coding";
import { useDashboardContext } from "#lib/front/dashboard-context";
import { fetcher, useFetch } from "#lib/front/fetch";
import { Button } from "#components/button";
import { Field } from "#components/field";
import { SkeletonContainer } from "#components/skeleton";
import styles from "../index.module.css";

export function SettingsProjectName() {

	const context = useDashboardContext();
	const [loading, setLoading] = useState(false);
	const [projectName, setProjectName] = useState('');
	const [project] = useFetch<APIResponseProject>({
		path: "/project",
		method: "get",
		scope: "project"
	});

	useEffect(() => {
		if (project) setProjectName(project.name);
	}, [project]);

	const handleUpdate = useCallback(() => {
		setLoading(true);
		fetcher<APIResponseProject>({
			path: "/project",
			method: "put",
			body: { name: projectName }
		}).then(res => {
			setProjectName(res.name);
			context.setProject(res);
		})
			.finally(() => setLoading(false))
	}, [projectName, context]);

	return <section>
		<h3>Name</h3>
		<p>Change the name of your project.</p>
		<div className={styles.flex}>
			<SkeletonContainer hasLoaded={Boolean(project)} height={42}>
				<Field
					disabled={loading}
					value={projectName}
					icon={RxLetterCaseCapitalize}
					onChange={setProjectName}
					placeholder='Project Name'
				/>
			</SkeletonContainer>
			<Button
				onClick={handleUpdate}
				disabled={loading || !project}
				value="Update"
			/>
		</div>
	</section>
}