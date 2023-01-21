import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { APIResponseUser } from "#pages/api/user";
import { APIResponseProject } from "lib/api/coding";
import { useCallback } from "react";
import { fetcher } from "./fetch";
import { useEffect } from "react";
import { useRef } from "react";

interface DashboardContext {
	project: APIResponseProject | undefined;
	setProject: Dispatch<SetStateAction<APIResponseProject | undefined>>;
	user: APIResponseUser | undefined;
	setUser: Dispatch<SetStateAction<APIResponseUser | undefined>>;
	lastUpdated: number;
}

const context = createContext<DashboardContext>({} as DashboardContext);

async function fetchProject(): Promise<APIResponseProject> {
	return await fetcher<APIResponseProject>({
		path: "/project",
		method: "get",
		scope: "project",
		silent: true,
	})
}

async function fetchUser(): Promise<APIResponseUser> {
	return await fetcher<APIResponseUser>({
		path: "/user",
		method: "get",
		scope: "user",
		silent: true,
	})
}

function fetchFromLocalStorage<T>(key: string): T | undefined {
	const value = localStorage.getItem(key);
	if (!value) return undefined;
	return JSON.parse(value) as T;
}

export function DashboardProvider({ children }: { children: ReactNode }) {

	const [user, setUser] = useState<APIResponseUser | undefined>(undefined);
	const [project, setProject] = useState<APIResponseProject | undefined>(undefined);
	const [lastUpdated, setLastUpdated] = useState<number>(0);
	const interval = useRef<NodeJS.Timer | null>(null);

	useEffect(() => {
		setUser(fetchFromLocalStorage('user'));
		setProject(fetchFromLocalStorage('project'));
	}, []);

	const fetchScopes = useCallback(() => {
		(async () => {
			console.info("Sync Service: FETCH", new Date().toLocaleTimeString())
			const user = await fetchUser();
			const project = await fetchProject();
			setUser(user);
			setProject(project);
		})().catch(error => {
			console.error('Sync Service: ERROR - ', error);
		})
	}, []);

	useEffect(() => {
		const visibilityChanged = () => {
			const isVisible = document.visibilityState === 'visible';
			if (isVisible) fetchScopes();
			else if (interval.current) clearInterval(interval.current);
		}

		document.addEventListener('visibilitychange', visibilityChanged);
		return () => document.removeEventListener('visibilitychange', visibilityChanged);
	}, [fetchScopes]);

	const startInterval = useCallback(() => {
		console.info("Starting Sync Service", new Date().toLocaleTimeString())
		interval.current = setInterval(() => {
			fetchScopes();
		}, 10000);
	}, [fetchScopes]);

	const killInterval = useCallback(() => {
		console.info("Killing Sync Service", new Date().toLocaleTimeString())
		if (interval.current) clearInterval(interval.current);
	}, [])

	useEffect(() => {

		// fetch on load
		fetchScopes();

		// clear on load
		killInterval();

		// start interval 
		startInterval();

		// handle visibility change
		const visibilityChanged = () => {
			const isVisible = document.visibilityState === 'visible';
			if (isVisible) {
				startInterval();
			} else {
				killInterval();
			}
		}

		// add listener
		document.addEventListener('visibilitychange', visibilityChanged);

		return () => {
			killInterval();
			document.removeEventListener('visibilitychange', visibilityChanged);
		}
	}, [fetchScopes, startInterval, killInterval]);

	useEffect(() => {
		if (!user) return;
		localStorage.setItem('user', JSON.stringify(user))
	}, [user]);

	useEffect(() => {
		if (!project) return;
		localStorage.setItem('project', JSON.stringify(project))
	}, [project]);

	useEffect(() => {
		setLastUpdated(Date.now());
	}, [project, user])

	return <context.Provider value={{
		user,
		setUser,
		project,
		setProject,
		lastUpdated
	}}>
		{children}
	</context.Provider>
}

export function useDashboardContext() {
	return useContext(context);
}

export function useProject(): APIResponseProject | undefined {
	return useDashboardContext().project;
}

export function useUser(): APIResponseUser | undefined {
	return useDashboardContext().user;
}