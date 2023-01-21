import clsx from "clsx";
import styles from "./index.module.css";

export function Badge({
	value,
	color = 'default'
}: {
	value: string;
	color?: 'default' | 'success' | 'error' | 'warning' | 'hobby' | 'pro' | 'business';
}): JSX.Element {
	return <div className={clsx(styles.badge, {
		[styles.default]: color === 'default',
		[styles.success]: color === 'success',
		[styles.error]: color === 'error',
		[styles.warning]: color === 'warning',
		[styles.hobby]: color === 'hobby',
		[styles.pro]: color === 'pro',
		[styles.business]: color === 'business',
	})}>
		<span>{value}</span>
	</div>
}

export function PlanBadge({ type }: { type?: 'hobby' | 'pro' | 'business' }): JSX.Element {
	return <Badge value={type?.toUpperCase() ?? 'HOBBY'} color={type ?? 'hobby'} />
}

export function HobbyBadge(): JSX.Element {
	return <PlanBadge type='hobby' />
}

export function ProBadge(): JSX.Element {
	return <PlanBadge type='pro' />
}

export function BusinessBadge(): JSX.Element {
	return <PlanBadge type='business' />
}