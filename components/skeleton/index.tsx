import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./index.module.css";

interface SkeletonProps {
	width?: number | string;
	height: number | string;
	noBorder?: boolean;
	noBackground?: boolean;
}

export function Skeleton({
	width = '100%',
	height,
	noBorder = false,
	noBackground = false,
}: SkeletonProps) {
	return <div
		style={{
			width,
			height
		}}
		className={clsx(
			styles.skeleton,
			noBorder && styles.noBorder,
			noBackground && styles.noBackground,
		)}
	>
		<div className={styles.outer}>
			<div className={styles.inner} />
		</div>
	</div>
}

export function SkeletonContainer({
	children,
	hasLoaded,
	width = "100%",
	height,
}: {
	children: ReactNode;
	hasLoaded: boolean;
	width?: number | string;
	height: number | string;
}) {
	return <div style={{
		width,
		height,
		position: 'relative'
	}}>
		<Skeleton width={width} height={height} />
		<div className={clsx(styles.childrenContainer, hasLoaded && styles.hasLoaded)}>
			{children}
		</div>
	</div>
}