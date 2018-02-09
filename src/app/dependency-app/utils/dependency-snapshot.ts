import { DependencySnapshotItem } from '../model/data.model';

export class DependencySnapshot {
    public static DEP_SNAPSHOT: Array<DependencySnapshotItem> = [];
    public static DEP_ADDED: Array<DependencySnapshotItem> = [];
    public static ECOSYSTEM: string;
    public static REQUEST_ID: string;
}
