import clsx from "clsx";
import { Button } from "../components/button";
import { MarketingPage } from "../components/marketing-page";
import styles from "../styles/about-page.module.css";
import { RxChevronDown } from "react-icons/rx";

export default function Page() {
	return <MarketingPage title="about">
		<div className={styles.page}>
			<div className={styles.heroContainer}>
				<div className={styles.blobContainer}>
					<div className={clsx(styles.blob, styles.leftBlob)} />
					<div className={clsx(styles.blob, styles.rightBlob)} />
				</div>
				<section className={styles.hero}>
					<div className={styles.heroHeader}>
						<h1>Your new backend solution for forms</h1>
						<h1 className={styles.colorfulHeader}>snatch</h1>
					</div>
					<div className={clsx(styles.hFlex, styles.heroCTA)}>
						<Button gradient href='/sign-up' value="Sign Up" />
						<Button href='/pricing' secondary value="Pricing" />
					</div>
				</section>
				<a href="#sec1" className={styles.arrow}>
					<RxChevronDown />
				</a>
			</div>
			<section id='sec1'>
				<h2>This is a Header</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</section>
			<div className={styles.dark}>
				<section>
					<h2>This is a Header</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</section>
			</div>
			<section>
				<h2>This is a Header</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			</section>
		</div>
	</MarketingPage>
}