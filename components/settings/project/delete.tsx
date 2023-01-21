import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { APIResponseProject } from "lib/api/coding";
import { fetcher } from "lib/front/fetch";
import { Button } from "#components/button";

export function SettingsProjectDelete() {

	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleDelete = useCallback(() => {
		setLoading(true);
		fetcher<APIResponseProject>({
			path: "/project",
			method: "delete"
		}).then(() => router.push("/projects"))
			.finally(() => setLoading(false));
	}, [router]);

	return <section>
		<h3>Delete Project</h3>
		<p>Delete your current project. This action is irreversible.</p>
		<Button
			disabled={loading}
			onClick={handleDelete}
			destructive
			value="Delete Project"
		/>
	</section>
}