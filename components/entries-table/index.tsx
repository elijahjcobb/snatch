import clsx from "clsx";
import { useMemo } from "react";
import { APIResponseEntry } from "../../helpers/api/coding";
import { truncate } from "../../helpers/front/truncate";
import styles from "./index.module.css";

export function EntriesTable({
	entries
}: {
	entries: APIResponseEntry[];
}) {

	const headers = useMemo<string[]>(() => {
		const items = new Set<string>();
		for (const entry of entries) {
			const fields = typeof entry.fields === 'object' ? entry.fields as {} : {};
			for (const key of Object.keys(fields)) items.add(key);
		}
		return Array.from(items).sort();
	}, [entries]);

	return <div className={styles.tableContainer}>
		<table className={styles.table}>
			<thead>
				<tr>
					<th style={{ minWidth: 210 }}>Date</th>
					{headers.map(header => <th key={header}>{header}</th>)}
				</tr>
			</thead>
			<tbody>
				{entries.map(entry => <Row entry={entry} headers={headers} key={entry.id} />)}
			</tbody>
		</table>
	</div>
}

type Item = { key: string, value: string | null };

function Row({
	entry,
	headers
}: {
	entry: APIResponseEntry,
	headers: string[]
}) {

	const data = useMemo<Item[]>(() => {
		const items: Item[] = [];
		for (const key of headers) {
			// @ts-expect-error - Ignore error.
			const value: string = entry.fields[key]
			items.push({ key, value })
		}
		return items;
	}, [entry, headers]);

	const dateString = useMemo(() => {
		return new Date(entry.createdAt).toLocaleDateString('en-us', {
			year: "2-digit",
			month: "short",
			day: "numeric",
			minute: 'numeric',
			hour: 'numeric',
			second: 'numeric'
		})
	}, [entry]);

	return <tr>
		<td>{dateString}</td>
		{data.map((item) => <RowValue key={item.key} item={item} />)}
	</tr>
}

function RowValue({ item }: { item: Item }) {

	const truncatedValue = useMemo<string>(() => {
		if (!item.value) return "null";
		return truncate(item.value, 40);
	}, [item.value]);

	return <td
		className={clsx(!item.value && styles.disabled)}
		key={item.key}>{truncatedValue}</td>
}