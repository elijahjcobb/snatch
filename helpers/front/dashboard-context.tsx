import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { APIResponseUser } from "#pages/api/user";
import { APIResponseProject } from "#lib/api/coding";

interface DashboardContext {
	project: APIResponseProject | undefined;
	setProject: Dispatch<SetStateAction<APIResponseProject | undefined>>;
	user: APIResponseUser | undefined;
	setUser: Dispatch<SetStateAction<APIResponseUser | undefined>>;
}

const context = createContext<DashboardContext>({} as DashboardContext);

export function DashboardProvider({ children }: { children: ReactNode }) {

	const [user, setUser] = useState<APIResponseUser | undefined>(undefined);
	const [project, setProject] = useState<APIResponseProject | undefined>(undefined);

	return <context.Provider value={{
		user,
		setUser,
		project,
		setProject
	}}>
		{children}
	</context.Provider>
}

export function useDashboardContext() {
	return useContext(context);
}