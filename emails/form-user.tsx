import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { p } from "./styles";
import { EmailTemplate } from './template';

export function EmailFormSubmittedUser() {
	return <EmailTemplate
		preview={`Form successfully submitted.`}
		title={`👋 Hello!`}
		footer='Have a great day! :)'>
		<Text style={p}>Your form was successfully submitted on <Link href='https://snatch.fyi'>snatch.fyi!</Link></Text>
	</EmailTemplate>
}

export default EmailFormSubmittedUser;