import Link from "next/link";
import { Icon } from "../icon";
import styles from "./index.module.css";

export function Footer() {
	return <footer className={styles.footer}>
		<Link href='/about' className={styles.title}>
			<Icon size={24} />
			<span>snatch.fyi</span>
		</Link>
		<div>

		</div>
	</footer>
}