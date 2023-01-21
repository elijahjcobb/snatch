import { ContactRow } from "#components/contact-row";
import { DashboardPage, DashboardPageLoader } from "#components/dashboard-page";
import { useFetch } from "lib/front/fetch";
import type { APIResponseContacts } from "#api/contacts";
import styles from "#styles/contacts-page.module.css";

export default function Page() {

	const [contacts] = useFetch<APIResponseContacts>({
		path: "/contacts",
		method: "get"
	})

	return <DashboardPage maxWidth={912} useMaxWidth title='users'>
		{contacts ? <div className={styles.list}>
			{contacts.map(contact => <ContactRow contact={contact} key={contact.id} />)}
		</div> : <DashboardPageLoader />}
	</DashboardPage>
}