import { Button } from "../../components/button";
import { DashboardPage, DashboardPageLoader } from "../../components/dashboard-page";
import { Field } from "../../components/field";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { useContext, useEffect, useState } from "react";
import { context, useProject } from "../../helpers/front/use-project";

export default function Page() {

	const project = useProject();
	const [projectName, setProjectName] = useState('');

	useEffect(() => {
		console.log({ localProjChanged: project })
	}, [project]);

	const foo = useContext(context);
	console.log({ foo });

	return <DashboardPage useMaxWidth title='settings'>
		{project ? <>
			<h2>Project Settings</h2>
			<section>
				<h3>Name</h3>
				<p>Change the name of your project.</p>
				<Field
					value={projectName}
					icon={RxLetterCaseCapitalize}
					onChange={setProjectName}
					placeholder='Project Name'
				/>
			</section>
			<section>
				<h3>Delete Project</h3>
				<p>Delete your current project. This action is irreversible.</p>
				<Button
					destructive
					value="Delete Project"
				/>
			</section>
		</> : <DashboardPageLoader />}
	</DashboardPage>
}