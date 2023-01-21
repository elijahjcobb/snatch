import styles from "./index.module.css";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { Copier } from "../copier";
import { IoMail, IoCall } from "react-icons/io5";
import { APIResponseContact } from "#api/contacts";
import { formatRelativeDate } from "lib/date-formatter";
import { truncate } from "lib/front/truncate";

export function ContactRow({
	contact,
	onClick
}: {
	contact: APIResponseContact,
	onClick?: (contact: APIResponseContact) => void;
}) {

	const handleClick = useCallback(() => {
		if (onClick) onClick(contact);
	}, [contact, onClick]);

	const initials = useMemo(() => {
		return `${contact.firstName?.charAt(0) ?? ''}${contact.lastName?.charAt(0) ?? ''}`
	}, [contact.firstName, contact.lastName]);
	const name = useMemo(() => truncate(`${contact.firstName ?? '-'} ${contact.lastName ?? '-'}`, 20), [contact.firstName, contact.lastName]);
	const email = useMemo(() => truncate(contact.email ?? '', 30), [contact.email]);
	const phone = useMemo(() => truncate(contact.phone ?? '', 30), [contact.phone]);
	const date = useMemo(() => formatRelativeDate(contact.createdAt), [contact.createdAt]);

	return <button onClick={handleClick} className={clsx(styles.row, onClick && styles.clickable)}>
		<div className={styles.left}>
			<div className={styles.profile}>
				<span>{initials}</span>
			</div>
			<div className={styles.middle}>
				<div className={styles.name}>
					<span>{name}</span>
				</div>
				<span>{date}</span>
			</div>
		</div>
		<div className={styles.right}>
			<Copier icon={IoCall} trim={30} value={phone} />
			<Copier icon={IoMail} trim={30} value={email} />
		</div>
	</button>
}