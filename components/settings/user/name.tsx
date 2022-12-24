import { useCallback, useEffect, useState } from "react";
import { fetcher, useFetch } from "../../../helpers/front/fetch";
import { Button } from "../../button";
import { Field } from "../../field";
import { SkeletonContainer } from "../../skeleton";
import styles from "../index.module.css";
import { IoPerson } from "react-icons/io5";
import { APIResponseUser } from "../../../pages/api/user";

export function SettingsUserName() {

	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');
	const [user] = useFetch<APIResponseUser>({
		path: "/user",
		method: "get",
		scope: "user"
	});

	useEffect(() => {
		if (user) setName(user.name);
	}, [user]);

	const handleUpdate = useCallback(() => {
		setLoading(true);
		fetcher<APIResponseUser>({
			path: "/user",
			method: "put",
			scope: "user",
			body: { name }
		}).then(res => {
			setName(res.name);
		})
			.finally(() => setLoading(false))
	}, [name]);

	return <section>
		<h3>Name</h3>
		<p>Change your name.</p>
		<div className={styles.flex}>
			<SkeletonContainer hasLoaded={Boolean(user)} height={42}>
				<Field
					disabled={loading}
					value={name}
					icon={IoPerson}
					onChange={setName}
					placeholder='Name'
				/>
			</SkeletonContainer>
			<Button
				onClick={handleUpdate}
				disabled={loading || !user}
				value="Update"
			/>
		</div>
	</section>
}