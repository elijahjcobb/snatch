import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { p, button } from "./styles";
import { EmailTemplate } from './template';

export function EmailFormSubmittedAdmin({ name, url }: { name: string, url: string }) {
	return <EmailTemplate
		preview={`New form submission.`}
		title={`📝 Form Submission.`}>
		<Text style={p}>{`Your form '${name}' just received a new submission. Check it out on snatch by clicking the button below.`}</Text>
		<Link style={button} href={url}>View Response</Link>
	</EmailTemplate>
}

export default EmailFormSubmittedAdmin;