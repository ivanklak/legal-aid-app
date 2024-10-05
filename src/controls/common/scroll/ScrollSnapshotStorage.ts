import {RuntimeError} from "../../../core/errors";
import {ScrollSnapshot} from "./ScrollSnapshot";

type Identifier = string;

// хранилище слепков по видимым областям списков
export class ScrollSnapshotStorage {
	private static _map: Map<Identifier, ScrollSnapshot> = new Map<string, ScrollSnapshot>();

	// есть ли запись
	public static has(name: Identifier) {
		if (!name) throw new RuntimeError('ScrollSnapshotStorage.add: name not set');
		//
		return ScrollSnapshotStorage._map.has(name);
	}

	// положить в хранилище
	public static add(name: Identifier, snapshot: ScrollSnapshot) {
		if (!name) throw new RuntimeError('ScrollSnapshotStorage.add: name not set');
		if (!snapshot) throw new RuntimeError('ScrollSnapshotStorage.add: snapshot not set');
		if (ScrollSnapshotStorage._map.has(name)) throw new RuntimeError(`ScrollSnapshotStorage.add: snapshot with name '${name}' already exist`);
		//
		ScrollSnapshotStorage._map.set(name, snapshot);
	}

	// изъять из хранилища и вернуть
	public static pop(name: Identifier) {
		if (!name) throw new RuntimeError('ScrollSnapshotStorage.add: name not set');
		//
		const retval = ScrollSnapshotStorage._map.get(name);
		if (retval) ScrollSnapshotStorage._map.delete(name);
		return retval;
	}
}
