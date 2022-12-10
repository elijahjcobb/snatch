import styles from "./index.module.css";
import { IconType } from "react-icons/lib";
import Link from "next/link";

export function StatCard({
	href,
	name,
	count,
	icon: Icon
}: {
	href: string,
	name: string,
	count: number,
	icon: IconType
}) {
	return <Link href={href} className={styles.card}>
		<Icon className={styles.icon} />
		<span className={styles.count}>{count}</span>
		<span className={styles.name}>{name}</span>
	</Link>
}