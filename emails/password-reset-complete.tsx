import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { p } from "./styles";
import { EmailTemplate } from './template';

export function EmailPasswordResetComplete() {
	return <EmailTemplate
		preview={`Password reset complete.`}
		title={`Password reset complete.`}>
		<Text style={p}>Your password was just successfully reset on <Link href='https://snatch.fyi'>snatch.fyi</Link>.</Text>
	</EmailTemplate>
}

export default EmailPasswordResetComplete;