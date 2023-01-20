import { MouseEvent, useCallback, useMemo } from "react";
import { toast } from "../toast";
import styles from "./index.module.css";
import { IoCopy } from "react-icons/io5";
import { truncate } from "#lib/front/truncate";
import clsx from "clsx";
import { IconType } from "react-icons";

export function Copier({
	value,
	trim = 72,
	className,
	icon: Icon
}: {
	value?: string,
	trim?: number,
	className?: string;
	icon?: IconType;
}) {


	const display = useMemo(() => truncate(value ?? "-", trim), [trim, value]);

	const handleCopy = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
		ev.stopPropagation();
		navigator.clipboard.writeText(value ?? "")
			.then(() => toast({ message: "Copied to clipboard" }))
			.catch(() => toast({ message: "Failed to copy to clipboard", status: "error" }))
	}, [value]);

	return <button disabled={!value || value.length === 0} onClick={handleCopy} className={clsx(styles.url, className)}>
		{Icon ? <Icon size={16} /> : <IoCopy size={16} />}
		<span>{display}</span>
	</button>
}