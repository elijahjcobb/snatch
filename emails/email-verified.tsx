import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { p } from "./styles";
import { EmailTemplate } from './template';

export function EmailVerified() {
	return <EmailTemplate
		preview={`Email now verified.`}
		title={`Email Verified!`}
		footer='Thanks again for joining snatch!'>
		<Text style={p}>Your email was just verified on <Link href='https://snatch.fyi'>snatch.fyi</Link>.</Text>
	</EmailTemplate>
}

export default EmailVerified;