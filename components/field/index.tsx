import { ChangeEvent, HTMLInputTypeAttribute, KeyboardEvent, useCallback, useRef } from "react";
import { IconType } from "react-icons/lib";
import styles from "./index.module.css";

type FieldAutocomplete = 'off' | 'on' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'nickname' | 'email' | 'username' | 'new-password' | 'current-password' | 'one-time-code' | 'organization-title' | 'organization' | 'tel' | 'url';

export function Field({
	value,
	onChange,
	icon: Icon,
	placeholder,
	onEnter,
	type = 'text',
	autoComplete = 'off',
	disabled,
	showLabel = false,
	mono = false,
	label = placeholder
}: {
	value: string;
	onChange: (value: string) => void;
	icon?: IconType;
	placeholder?: string;
	onEnter?: () => void;
	type?: HTMLInputTypeAttribute;
	autoComplete?: FieldAutocomplete;
	disabled?: boolean;
	showLabel?: boolean;
	label?: string;
	mono?: boolean;
}) {

	const field = useRef<HTMLInputElement>(null);

	const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
		onChange(ev.target.value);
	}, [onChange]);

	const handleKeyPress = useCallback((ev: KeyboardEvent<HTMLInputElement>) => {
		if (ev.key === 'Enter') {
			if (onEnter) onEnter();
		}
	}, [onEnter]);

	const handleClick = useCallback(() => {
		if (disabled) return;
		field.current?.focus();
	}, [disabled]);

	return <div onClick={handleClick} className={styles.container}>
		{Icon || showLabel ? <div className={styles.iconContainer}>
			{Icon ? <Icon className={styles.icon} /> : null}
			{showLabel ? <span className={styles.label}>{label}</span> : null}
		</div> : null}
		<input
			ref={field}
			type={type}
			onKeyDown={handleKeyPress}
			placeholder={placeholder}
			className={styles.field}
			onChange={handleChange}
			autoComplete={autoComplete}
			disabled={disabled}
			style={{
				fontFamily: mono ? "var(--font-mono)" : "var(--font)",
				fontSize: mono ? "1rem" : "1.0625rem"
			}}
			value={value} />
	</div>
}