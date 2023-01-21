import { MarketingPage } from "#components/marketing-page";
import styles from "#styles/404-page.module.css";

export default function Page(): JSX.Element {
	return <MarketingPage>
		<div className={styles.container}>
			<span className={styles.title}>500</span>
			<span>We had a hiccup. Our team has been notified... :/</span>
		</div>
	</MarketingPage>
}