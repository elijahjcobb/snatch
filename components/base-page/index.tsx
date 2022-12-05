import Head from "next/head";
import { ReactNode, useMemo } from "react";

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

	return <div>
		<Head>
			<title>{title}</title>
		</Head>
		{children}
	</div>
}