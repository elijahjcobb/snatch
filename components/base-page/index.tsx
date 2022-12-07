import Head from "next/head";
import { ReactNode, useMemo } from "react";
import { ErrorBoundary } from 'react-error-boundary'


export function BasePage({
	children,
	title: pageTitle
}: {
	children: ReactNode;
	title?: string;
}) {

	const title = useMemo(() => {
		if (!pageTitle) return "snatch";
		return `${pageTitle} | snatch`
	}, [pageTitle])

	return <ErrorBoundary
		onError={(error, info) => console.error("AHH", error, info)}
		fallback={<p>This is awkward. There was an error.</p>}
	>
		<div>
			<Head>
				<title>{title}</title>
			</Head>
			{children}
		</div>
	</ErrorBoundary>
}