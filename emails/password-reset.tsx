import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { p, codeBlock } from "./styles";
import { EmailTemplate } from './template';

export function EmailPasswordReset({
	otp
}: {
	otp: string
}) {
	return <EmailTemplate
		preview={`snatch.fyi - code: ${otp}`}
		title={`🔒 Password Reset`}>
		<Text style={p}>Your account just received a password reset request on <Link href='https://snatch.fyi'>snatch.fyi</Link>. Please provide the code below:</Text>
		<Text style={codeBlock}>{otp}</Text>
	</EmailTemplate>
}

export default EmailPasswordReset;