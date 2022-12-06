import type { IconType } from "react-icons";
import styles from "./index.module.css";
import { IoCheckbox, IoSquareOutline } from "react-icons/io5";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import clsx from "clsx";

export function Toggle({
	value = false,
	onChange,
	icon: Icon,
	disabled,
	label
}: {
	value?: boolean;
	onChange?: Dispatch<SetStateAction<boolean>>;
	icon?: IconType;
	disabled?: boolean;
	label?: string;
}) {

	const Checkbox = useMemo(() => value ? IoCheckbox : IoSquareOutline, [value]);

	const handleClick = useCallback(() => {
		if (onChange) onChange(v => !v);
	}, [onChange]);

	return <button
		disabled={disabled}
		className={clsx(styles.button, value && styles.enabled)}
		onClick={handleClick}
	>
		{Icon ? <Icon size={24} /> : null}
		{label ? <span>{label}</span> : null}
		<Checkbox size={24} />
	</button>
}