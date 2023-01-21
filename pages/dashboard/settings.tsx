
import { DashboardPage } from "#components/dashboard-page";
import { SettingsProjectDelete } from "#components/settings/project/delete";
import { SettingsProjectMembers } from "#components/settings/project/members";
import { SettingsProjectName } from "#components/settings/project/name";
import { SettingsProjectPlan } from "#components/settings/project/plan";
import { SettingsUserName } from "#components/settings/user/name";

export default function Page() {
	return <DashboardPage useMaxWidth title='settings'>
		<UserSettings />
		<ProjectSettings />
	</DashboardPage>
}

function UserSettings() {
	return <>
		<h2>User Settings</h2>
		<SettingsUserName />
	</>
}

function ProjectSettings() {
	return <>
		<h2>Project Settings</h2>
		<SettingsProjectName />
		<SettingsProjectPlan />
		<SettingsProjectMembers />
		<SettingsProjectDelete />
	</>
}