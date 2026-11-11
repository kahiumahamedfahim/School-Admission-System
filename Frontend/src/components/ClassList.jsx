import ClassCard from "./ClassCard";
import { BuildingIcon } from "./Icons";

function ClassList({ classes, studentId, onHoldCreated }) {
    if (!classes || classes.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                    <BuildingIcon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                    No classes available yet
                </h3>

                <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
                    Classes created by the school office will appear here
                    automatically.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {classes.map((classData, index) => (
                <div
                    key={classData.id}
                    className="animate-rise"
                    style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
                >
                    <ClassCard
                        classData={classData}
                        studentId={studentId}
                        onHoldCreated={onHoldCreated}
                    />
                </div>
            ))}
        </div>
    );
}

export default ClassList;
