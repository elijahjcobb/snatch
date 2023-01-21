import { Button } from "#components/button";
import { Icon } from "#components/icon";
import styles from "#styles/submission-success.module.css";
import clsx from "clsx";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

export default function Page() {

	const [destination, setDestination] = useState<string | undefined>(undefined);
	const [domain, setDomain] = useState<string | undefined>(undefined);

	useEffect(() => {
		const search = window.location.search;
		const params = new URLSearchParams(search);
		const url = params.get('next');
		if (!url) return;

		setDestination(url);

		let d = url.replace("https://", "");
		d = d.replace("http://", "");
		d = d.split("/")[0];
		setDomain(d);

	}, []);

	return <div className={styles.page}>
		<nav className={styles.title}>
			<Icon size={72} />
			<h1>Form Submitted</h1>
		</nav>
		<p>You form has been securely submitted.</p>
		<Button className={clsx(styles.button, destination && domain && styles.show)} href={destination ?? ''} value={`Go to ${domain}`} />
		<footer className={styles.footer}>
			<Icon size={16} />
			<span>{' '}Managed by{' '}</span>
			<Link href={"https://snatch.fyi/about"}>snatch.fyi</Link>
		</footer>
	</div>
}