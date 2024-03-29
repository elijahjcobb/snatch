import { MarketingPage } from "#components/marketing-page";
import styles from "#styles/404-page.module.css";

export default function Page(): JSX.Element {
	return <MarketingPage>
		<div className={styles.container}>
			<span className={styles.title}>404</span>
			<span>You found a page that does not exist... :/</span>
		</div>
	</MarketingPage>
}