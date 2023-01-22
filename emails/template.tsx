import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Preview } from '@react-email/preview';
import { Text } from '@react-email/text';
import * as React from 'react';
import { h1, p } from './styles';
import { Hr } from '@react-email/hr';

export function EmailTemplate({
	children,
	preview,
	title,
	footer = '- The snatch team'
}: {
	children: JSX.Element | JSX.Element[],
	preview: string,
	title: string,
	footer?: string
}) {
	return <Html>
		<Head />
		<Preview>{preview}</Preview>
		<Container style={{
			background: 'white',
			fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
			padding: 48,
			fontSize: 18
		}}>
			<Img
				src={`https://snatch.fyi/logo-blue.svg`}
				width="200"
				height="44"
				alt="snatch"
				style={{ marginBottom: 48 }}
			/>
			<Text style={h1}>{title}</Text>
			<Container style={{ paddingBottom: 16 }}>
				{children}
			</Container>
			{footer ? <>
				<Hr />
				<Text style={p}>{footer}</Text>
			</> : null}
		</Container>
	</Html>
}