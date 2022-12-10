import { useCallback, useState } from "react";
import { DashboardPage } from "../../components/dashboard-page";
import { Field } from "../../components/field";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { Button } from "../../components/button";
import { IoAdd } from "react-icons/io5";
import { fetcher } from "../../helpers/front/fetch";
import { APIResponseUserProjects } from "../api/user/projects";
import { setCookie30Day } from "../../helpers/cookie";
import { useRouter } from "next/router";

export default function ProjectsCreatePage() {

	const router = useRouter();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = useCallback(() => {
		setLoading(true);
		fetcher<APIResponseUserProjects>({
			path: "/user/projects",
			method: "post",
			body: { name }
		}).then(res => {
			const project = res[0];
			setCookie30Day('project', project.token);
			setCookie30Day('projectId', project.project.id);
			router.push("/dashboard");
		}).finally(() => {
			setLoading(false);
		})
	}, [name, router]);

	return <DashboardPage useMaxWidth>
		<h2>Create Project</h2>
		<section>
			<h3>Name</h3>
			<Field
				disabled={loading}
				value={name}
				onChange={setName}
				placeholder='Name'
				icon={RxLetterCaseCapitalize}
			/>
		</section>
		<Button
			disabled={loading}
			icon={IoAdd}
			onClick={handleSubmit}
			value="Create Project"
		/>
	</DashboardPage>
}