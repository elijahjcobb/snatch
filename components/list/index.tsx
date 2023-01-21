import { IconType } from "react-icons/lib";
import { FaMousePointer } from "react-icons/fa";
import styles from "./index.module.css";
import { MouseEvent, RefObject, useCallback, useMemo } from "react";
import clsx from "clsx";
import { useAutoAnimate } from '@formkit/auto-animate/react'

export interface ListData { value: string, icon?: IconType, actionIcon?: IconType, id: string; };

export interface ListBaseProps {
	icon?: IconType;
	actionIcon?: IconType;
	onClick?: (id: string) => void;
	onActionClick?: (id: string) => void;
}

export interface ListProps extends ListBaseProps {
	items: ListData[];
}

export interface ListItemProps extends ListBaseProps {
	item: ListData;
}

export function ListItem({
	item,
	actionIcon,
	onClick,
	onActionClick,
	icon
}: ListItemProps) {

	const Icon = useMemo(() => item.icon ?? icon, [item.icon, icon]);
	const ActionIcon = useMemo(() => item.actionIcon ?? actionIcon ?? FaMousePointer, [item.actionIcon, actionIcon]);

	const handleOnClick = useCallback(() => {
		if (onClick) onClick(item.id);
	}, [onClick, item.id]);

	const handleOnActionClick = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
		ev.stopPropagation();
		if (onActionClick) onActionClick(item.id);
	}, [onActionClick, item.id]);

	return <li
		onClick={handleOnClick}
		className={clsx(styles.item, onClick && styles.clickable)}
		key={item.id}>
		{Icon ? <Icon className={styles.icon} size={20} /> : null}
		<span className={styles.text}>{item.value}</span>
		{onActionClick
			? <button className={styles.action} onClick={handleOnActionClick}>
				<ActionIcon size={20} className={styles.icon} />
			</button>
			: null}
	</li>
}

export function List({
	items,
	icon,
	actionIcon,
	onClick,
	onActionClick
}: ListProps) {
	const [parent] = useAutoAnimate<HTMLUListElement>();
	return <ul ref={parent} className={styles.list}>
		{items.map(item => <ListItem
			item={item}
			icon={icon}
			actionIcon={actionIcon}
			onClick={onClick}
			onActionClick={onActionClick}
			key={item.id} />)}
	</ul>
}