import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { APIResponseProject } from "../api/coding";
import { fetcher } from "./fetch";

interface Context {
	project: APIResponseProject | undefined;
	setProject: (value: APIResponseProject | undefined) => void;
	updateProject: () => void;
}

export const context = createContext<Context>({} as Context);

export function ProjectProvider({ children }: { children: ReactNode }) {

	const [project, setProject] = useState<APIResponseProject | undefined>(undefined);

	const updateProject = useCallback(() => {
		fetcher<APIResponseProject>({
			path: "/project",
			method: "get",
			scope: "project",
			showLoadingToast: false,
		}).then(setProject)
	}, []);

	useEffect(() => updateProject(), [updateProject]);

	useEffect(() => {
		console.log({ projectChanged: project })
	}, [project]);

	return <context.Provider value={{ project, setProject, updateProject }}>
		{children}
	</context.Provider>
}

export function useProject(): APIResponseProject | undefined {
	return useContext(context).project;
}

export function useSetProject() {
	const p = useContext(context);
	return () => p.setProject;
}

export function useUpdateProject() {
	const p = useContext(context);
	return () => p.updateProject;
}