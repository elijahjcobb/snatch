import { useCallback, useEffect, useState } from "react";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { APIResponseProject } from "#lib/api/coding";
import { useDashboardContext } from "#lib/front/dashboard-context";
import { fetcher, useFetch } from "#lib/front/fetch";
import { Button } from "#components/button";
import { Field } from "#components/field";
import { Skeleton, SkeletonContainer } from "#components/skeleton";
import styles from "./members.module.css";
import { IoPerson, IoTrashBin, IoMail } from "react-icons/io5";
import { List } from "#components/list";
import { APIResponseProjectMembers } from "#api/project/members";

export function SettingsProjectMembers() {

	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState('');
	const [members, setMembers] = useState<{ value: string, id: string }[]>([]);

	const [data] = useFetch<APIResponseProjectMembers>({
		path: `/project/members`,
		method: "get",
		scope: "project"
	});

	useEffect(() => {
		if (data) {
			setMembers(data.members.map(m => ({ value: m.name, id: m.id })));
			setLoading(false);
		}
	}, [data]);

	const handleInvite = useCallback(() => {
		setLoading(true);
		fetcher<APIResponseProjectMembers>({
			path: "/project/members",
			method: "post",
			body: { email },
			showLoadingToast: false
		}).then(res => {
			const newMember = res.members[0];
			setMembers(v => [...v, { id: newMember.id, value: newMember.name }]);
			setEmail('');
		})
			.finally(() => setLoading(false))
	}, [email]);

	const removeMember = useCallback((id: string) => {
		const membersCopy = [...members];
		setMembers(v => v.filter(m => m.id !== id));
		setLoading(true);
		fetcher<APIResponseProjectMembers>({
			path: "/project/members",
			method: "delete",
			body: { id },
			showLoadingToast: false
		})
			.catch(() => {
				setMembers(membersCopy);
			})
			.finally(() => setLoading(false))
	}, [members]);

	// 56 height skeleton
	return <section>
		<h3>Members</h3>
		<p>Manage your team&apos;s members.</p>
		<div className={styles.container}>
			{members.length === 0
				? <Skeleton height={58} />
				: <List
					items={members}
					icon={IoPerson}
					onActionClick={removeMember}
					actionIcon={IoTrashBin} />}
			<div className={styles.flex}>
				<Field
					className={styles.field}
					disabled={loading}
					value={email}
					type='email'
					icon={IoMail}
					onChange={setEmail}
					placeholder='Email'
				/>
				<Button
					onClick={handleInvite}
					disabled={loading}
					value="Invite"
				/>
			</div>
		</div>
	</section>
}