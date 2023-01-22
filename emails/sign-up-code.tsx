import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { p, codeBlock } from "./styles";
import { EmailTemplate } from './template';

export function EmailSignUp({
	name,
	otp
}: {
	name: string,
	otp: string
}) {
	return <EmailTemplate
		preview={`snatch.fyi - code: ${otp}`}
		title={`👋 Hello ${name}`}
		footer='Thank you for joining snatch!'>
		<Text style={p}>Welcome to <Link href='https://snatch.fyi'>snatch.fyi!</Link> We are happy to be your form backend service.</Text>
		<Text style={p}>As a part of signing up, we need to verify your email address for your security. Below is a code you can provide:</Text>
		<Text style={codeBlock}>{otp}</Text>
		<Text style={p}>If you need to navigate back to snatch, you can click the link below:<br /><Link href={`https://snatch.fyi/code?otp${otp}`}>snatch.fyi/code</Link></Text>
	</EmailTemplate>
}

export default EmailSignUp;