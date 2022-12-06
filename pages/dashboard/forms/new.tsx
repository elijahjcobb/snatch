import { DashboardPage } from "../../../components/dashboard-page";
import { FormView } from "../../../components/form-view";

export default function Page() {

	return <DashboardPage useMaxWidth title='forms'>
		<FormView title="Create Form" />
	</DashboardPage>
}