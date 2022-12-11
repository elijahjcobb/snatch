
import { DashboardPage } from "../../components/dashboard-page";
import { SettingsProjectDelete } from "../../components/settings/project/delete";
import { SettingsProjectName } from "../../components/settings/project/name";

export default function Page() {
	return <DashboardPage useMaxWidth title='settings'>
		<h2>Project Settings</h2>
		<SettingsProjectName />
		<SettingsProjectDelete />
	</DashboardPage>
}