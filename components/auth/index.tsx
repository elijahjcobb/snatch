import { Icon } from "../icon";
import styles from "./index.module.css";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { toast } from "../toast";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../button";
import { Field } from "../field";
import { ImSpinner } from "react-icons/im";
import { IoMail, IoLockClosed, IoPerson, IoShieldCheckmarkSharp } from 'react-icons/io5';
import clsx from "clsx";
import { fetcher } from "lib/front/fetch";
import { APIResponseUserSignIn } from "#pages/api/user/sign-in";
import { useRouter } from "next/router";
import Link from "next/link";
import { setCookie30Day } from "lib/cookie";

function Feature({ title, subtitle }: { title: string, subtitle: string }) {
	return <div className={styles.feature}>
		<BsFillCheckCircleFill className={styles.featureCheck} />
		<div className={styles.featureText}>
			<span className={styles.featureTitle}>{title}</span>
			<span className={styles.featureSubtitle}>{subtitle}</span>
		</div>
	</div>
}

export function AuthPage({
	type: initialType
}: {
	type: "sign-up" | "sign-in" | 'code' | 'reset' | 'reset-verify'
}) {

	const router = useRouter();
	const [type, setType] = useState(initialType);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [otp, setOtp] = useState('');

	const handleOppositeClick = useCallback(() => {
		setType(type => {
			const newUrl = type === 'sign-in' ? "sign-up" : "sign-in"
			history.pushState({}, '', `/${newUrl}`);
			return newUrl;
		});
	}, []);

	const handleResetClick = useCallback(() => {
		setType('reset');
		history.pushState({}, '', '/reset');
	}, []);

	const typeString = useMemo(() => {
		switch (type) {
			case 'code':
				return "Verify Code";
			case 'sign-in':
				return "Sign In";
			case 'sign-up':
				return "Sign Up";
			case 'reset':
				return "Reset";
			case 'reset-verify':
				return "Reset";
		}
	}, [type]);

	const typeCodeString = useMemo(() => {
		switch (type) {
			case 'code':
				return "verifyCode()";
			case 'sign-in':
				return "signIn()";
			case 'sign-up':
				return "signUp()";
			case 'reset':
				return "resetPassword()";
			case 'reset-verify':
				return "verifyPasswordReset()";
		}
	}, [type]);

	const handlePrimaryClick = useCallback(() => {
		setLoading(true);

		let body: object;
		let url: string;

		if (type === 'sign-up') {
			body = { email, password, name }
			url = "/sign-up"
		} else if (type === 'sign-in') {
			body = { email, password }
			url = "/sign-in"
		} else if (type === 'reset') {
			body = { email }
			url = '/reset'
		} else if (type === 'reset-verify') {
			body = { email: localStorage.getItem('email'), password, code: otp }
			url = '/reset/verify'
		} else {
			body = { code: otp }
			url = "/verify"
		}

		fetcher<APIResponseUserSignIn>({
			path: `/user${url}`,
			method: 'post',
			body,
			showLoadingToast: false
		})
			.then(({ userToken, projectId, projectToken }) => {
				if (type === 'reset') {
					localStorage.setItem('email', email);
					router.push("/reset/verify");
					return;
				}
				if (type === 'reset-verify') localStorage.removeItem('email');
				if (userToken) setCookie30Day('user', userToken);
				if ((!projectId || !projectToken) && type === 'code') {
					toast({ status: "error", message: "Invalid code." })
					return
				}
				if (projectId) setCookie30Day('projectId', projectId);
				if (projectToken) setCookie30Day('project', projectToken);
				router.push(type === 'sign-up' ? '/code' : "/dashboard");
			}).finally(() => {
				setLoading(false);
			})

	}, [email, password, router, type, name, otp]);

	return <div className={styles.container}>
		<div className={styles.left}>
			<Link href='/about' className={styles.header}>
				<Icon />
				<h1>snatch.fyi</h1>
			</Link>
			<div className={styles.features}>
				<Feature title="Collect form data from your static sites" subtitle="Quickly go from static to dynamic by sending your form data to snatch's servers." />
				<Feature title="View all responses in one place" subtitle="Check out snatch's dashboard to view all your form data across your sites with ZERO configuration." />
				<Feature title="Email notifications" subtitle="Configure notifications for both you and your form respondents when submissions are made." />
				<Feature title="Free to sign up" subtitle="No credit card to make an account and start collecting data." />
			</div>
		</div>
		<div className={styles.right}>
			<div className={styles.top}>
				<h2 className={styles.title}>{typeCodeString}</h2>
				<ImSpinner className={clsx(styles.spinner, loading && styles.showSpinner)} />
			</div>
			<div className={styles.fields}>
				{type !== 'code' && type !== 'reset-verify' ? <Field
					placeholder="email"
					value={email}
					type='email'
					mono
					autoComplete='email'
					onChange={setEmail}
					disabled={loading}
					icon={IoMail}
				/> : null}
				{type !== 'code' && type !== 'reset' ? <Field
					placeholder="password"
					value={password}
					type='password'
					mono
					disabled={loading}
					autoComplete={type === 'sign-up' ? 'new-password' : 'current-password'}
					onChange={setPassword}
					icon={IoLockClosed}
				/> : null}
				{type === 'sign-up' ? <Field
					placeholder="First Last"
					value={name}
					type='text'
					autoComplete='name'
					onChange={setName}
					disabled={loading}
					icon={IoPerson}
				/> : null}
				{type === 'code' || type === 'reset-verify' ? <Field
					placeholder="Code"
					value={otp}
					type='number'
					mono
					autoComplete="one-time-code"
					disabled={loading}
					onChange={setOtp}
					icon={IoShieldCheckmarkSharp}
				/> : null}
				{type === 'sign-in' ? <Button
					onClick={handleResetClick}
					disabled={loading}
					secondary
					value={'Reset Password'} /> : null}
			</div>
			<div className={styles.buttons}>
				{type !== "code" && type !== 'reset-verify' ? <Button
					onClick={handleOppositeClick}
					disabled={loading}
					value={type === 'sign-in' ? "Sign Up" : "Sign In"}
					secondary /> : null}
				<Button
					onClick={handlePrimaryClick}
					disabled={loading}
					value={typeString} />
			</div>
		</div>
	</div>
}