import clsx from "clsx";
import { Button } from "#components/button";
import { MarketingPage } from "#components/marketing-page";
import styles from "#styles/about-page.module.css";
import { RxChevronDown } from "react-icons/rx";
import Image from "next/image";

export default function Page() {
	return <MarketingPage title="about">
		<div className={styles.page}>
			<div className={styles.heroContainer}>
				<div className={styles.blobContainer}>
					<div className={clsx(styles.blob, styles.leftBlob)} />
					<div className={clsx(styles.blob, styles.rightBlob)} />
				</div>
				<div className={styles.hero}>
					<div className={styles.heroHeader}>
						<h1>Your new form backend solution</h1>
						<h1 className={styles.colorfulHeader}>snatch</h1>
					</div>
					<div className={clsx(styles.hFlex, styles.heroCTA)}>
						<Button gradient href='/sign-up' value="Sign Up" />
						<Button href='/pricing' secondary value="Pricing" />
					</div>
				</div>
				<div className={styles.try}>
					<h2>Try it out!</h2>
					<form action="https://snatch.fyi/api/entry/7cbe10f3-2029-41e1-b295-d5c1dbecce36" className={styles.form}>
						<div>
							<label htmlFor="name">Name:</label><br />
							<input type="text" autoComplete="name" id="name" name="name" placeholder="John Smith" />
						</div>
						<div>
							<label htmlFor="email">Email:</label><br />
							<input type="email" autoComplete="email" id="email" name="email" placeholder="hello@mail.com" />
						</div>
						<div>
							<label htmlFor="message">Message:</label><br />
							<input type="text" id="message" name="message" placeholder="Hello, world!" /><br />
						</div>
						<input className={styles.submit} type="submit" value="Submit" />
					</form>
				</div>
				<a href="#sec1" className={styles.arrow}>
					<RxChevronDown />
				</a>
			</div>
			<section id='sec1'>
				<Image src='https://via.placeholder.com/480x320.png' width={480} height={320} alt='placeholder' />
				<div>
					<h2>This is a Header</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</section>
			<div className={styles.dark}>
				<section>
					<Image src='https://via.placeholder.com/480x320.png' width={480} height={320} alt='placeholder' />
					<div>
						<h2>This is a Header</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					</div>
				</section>
			</div>
			<section>
				<Image src='https://via.placeholder.com/480x320.png' width={480} height={320} alt='placeholder' />
				<div>
					<h2>This is a Header</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</section>
			<div className={styles.dark}>
				<section>
					<Image src='https://via.placeholder.com/480x320.png' width={480} height={320} alt='placeholder' />
					<div>
						<h2>This is a Header</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					</div>
				</section>
			</div>
			<section>
				<Image src='https://via.placeholder.com/480x320.png' width={480} height={320} alt='placeholder' />
				<div>
					<h2>This is a Header</h2>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</section>
		</div>
	</MarketingPage>
}