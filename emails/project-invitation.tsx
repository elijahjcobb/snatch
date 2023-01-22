import { Text } from '@react-email/text';
import { Link } from '@react-email/link';
import * as React from 'react';
import { p } from "./styles";
import { EmailTemplate } from './template';

export function EmailProjectInvitation({
	projectName,
}: {
	projectName: string,
}) {
	return <EmailTemplate
		preview={`You were invited to join the '${projectName}' project on snatch.fyi.`}
		title={`🤝 You were invited to join '${projectName}'`}>
		<Text style={p}>{`You were just invited to join the project '${projectName}' on snatch.`}</Text>
		<Text style={p}>You do not need to respond, you have been automatically added to this project. If you would like to view or leave the project, check it out on snatch below:</Text>
		<Link href='https://snatch.fyi/projects'>snatch.fyi/projects</Link>
	</EmailTemplate>
}

export default EmailProjectInvitation;