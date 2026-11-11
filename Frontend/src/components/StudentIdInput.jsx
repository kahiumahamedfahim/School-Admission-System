import { studentIdSchema } from "../validation/studentSchema";
import {
    ArrowRightIcon,
    CheckIcon,
    IdIcon,
    ShieldIcon,
} from "./Icons";

function StudentIdInput({ studentId, setStudentId }) {
    const isValid = studentIdSchema.safeParse({ studentId }).success;

    const errorMessage =
        studentId.length === 0
            ? ""
            : isValid
                ? ""
                : "A Student ID is exactly 17 digits.";

    const handleChange = (event) => {
        const digitsOnly = event.target.value
            .replace(/\D/g, "")
            .slice(0, 17);

        setStudentId(digitsOnly);
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <label
                    htmlFor="studentId"
                    className="text-sm font-semibold text-slate-800"
                >
                    Student ID
                </label>

                <span className="tabular text-xs font-medium text-slate-400">
                    {studentId.length}/17
                </span>
            </div>

            <div className="relative mt-2">
                <IdIcon
                    className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${
                        isValid ? "text-emerald-500" : "text-slate-400"
                    }`}
                />

                <input
                    id="studentId"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    value={studentId}
                    onChange={handleChange}
                    placeholder="e.g. 20152691234567890"
                    maxLength={17}
                    aria-invalid={Boolean(errorMessage)}
                    aria-describedby="student-id-help"
                    className={`tabular w-full rounded-2xl border bg-white py-3.5 pl-12 pr-11 text-base font-medium tracking-wide text-slate-900 shadow-sm outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 ${
                        errorMessage
                            ? "border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                            : isValid
                                ? "border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                                : "border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    }`}
                />

                {isValid && (
                    <span className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckIcon className="h-3.5 w-3.5" />
                    </span>
                )}
            </div>

            {errorMessage ? (
                <p
                    id="student-id-help"
                    className="mt-2 text-xs font-medium text-rose-600"
                >
                    {errorMessage}
                </p>
            ) : (
                <p
                    id="student-id-help"
                    className="mt-2 flex items-center gap-1.5 text-xs text-slate-500"
                >
                    <ShieldIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    Used only to identify your admission application.
                </p>
            )}

            {isValid && (
                <a
                    href="#classes"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                >
                    Browse available classes
                    <ArrowRightIcon className="h-4 w-4" />
                </a>
            )}
        </div>
    );
}

export default StudentIdInput;
