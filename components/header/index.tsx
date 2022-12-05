import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isSignedIn } from '../../helpers/front/user';
import { Button } from '../button';
import { Icon } from '../icon';
import styles from './index.module.css';

function HeaderLink({
	href,
	value,
	newTab = false
}: {
	href: string;
	value: string;
	newTab?: boolean;
}) {
	return <Link target={newTab ? '_blank' : '_self'} className={styles.link} href={href} >
		{value}
	</Link >
}

export function Header() {

	const [signedIn, setSignedIn] = useState(false);

	useEffect(() => {
		setSignedIn(isSignedIn());
	}, []);

	return <header className={styles.header}>
		<Link href='/about' className={styles.title}>
			<Icon size={32} />
			<h1>snatch.fyi</h1>
		</Link>
		<nav className={styles.nav}>
			<div className={styles.links}>
				<HeaderLink href='/about' value='about' />
				<HeaderLink href='/pricing' value='pricing' />
				<HeaderLink href='/docs' value='docs' />
				<HeaderLink newTab href='https://github.com/elijahjcobb/snatch' value='source' />
			</div>
			<div className={styles.buttons}>
				{signedIn
					? <Button href='/dashboard' value='Dashboard' />
					: (<>
						<Button href='/sign-in' value='Sign In' secondary />
						<Button href='/sign-up' value='Sign Up' />
					</>)}
			</div>
		</nav>
	</header >
}