import { useState } from "react";
import { createHold } from "../services/holdService";
import {
    AlertIcon,
    ArrowRightIcon,
    CheckIcon,
    SeatIcon,
    SpinnerIcon,
} from "./Icons";

const STUDENT_ID_PATTERN = /^\d{17}$/;

function ClassCard({ classData, studentId, onHoldCreated }) {
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const totalSeats = classData.totalSeats ?? 0;
    const heldSeats = classData.heldSeats ?? 0;
    const confirmedSeats = classData.confirmedSeats ?? 0;
    const availableSeats =
        classData.availableSeats ??
        Math.max(0, totalSeats - heldSeats - confirmedSeats);

    const isFull = availableSeats <= 0;
    const hasValidId = STUDENT_ID_PATTERN.test(studentId);

    const safeTotal = Math.max(totalSeats, 1);
    const confirmedWidth = Math.min(100, (confirmedSeats / safeTotal) * 100);
    const heldWidth = Math.min(
        100 - confirmedWidth,
        (heldSeats / safeTotal) * 100
    );

    const availability = isFull
        ? {
              label: "Class full",
              chip: "bg-rose-50 text-rose-700 ring-rose-200",
              dot: "bg-rose-500",
          }
        : availableSeats <= 3
            ? {
                  label: "Few seats left",
                  chip: "bg-amber-50 text-amber-700 ring-amber-200",
                  dot: "bg-amber-500",
              }
            : {
                  label: "Open for applications",
                  chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
                  dot: "bg-emerald-500",
              };

    const handleApply = async () => {
        setMessage("");
        setError("");

        if (!hasValidId) {
            setError("Enter your 17-digit Student ID to reserve a seat.");
            return;
        }

        try {
            setSubmitting(true);

            const data = await createHold(classData.id, studentId);

            const expiresAt = data?.expiresAt
                ? new Date(data.expiresAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : null;

            setMessage(
                expiresAt
                    ? `Seat reserved until ${expiresAt}. Confirm it in your applications below.`
                    : "Seat reserved. Confirm it in your applications below."
            );

            onHoldCreated(data);
        } catch (requestError) {
            console.error("Failed to create hold:", requestError);

            if (requestError.response?.data?.message) {
                setError(requestError.response.data.message);
            } else {
                setError("We couldn't reserve a seat. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5">
            <div
                className={`absolute inset-x-0 top-0 h-1 ${
                    isFull
                        ? "bg-gradient-to-r from-rose-400 to-rose-500"
                        : "bg-gradient-to-r from-brand-500 via-indigo-500 to-sky-400"
                }`}
            />

            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                            isFull
                                ? "bg-rose-50 text-rose-500"
                                : "bg-brand-50 text-brand-600"
                        }`}
                    >
                        <SeatIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Admission class
                        </p>
                        <h3 className="truncate text-lg font-bold tracking-tight text-slate-900">
                            {classData.name}
                        </h3>
                    </div>
                </div>

                <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${availability.chip}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${availability.dot}`}
                    />
                    {availability.label}
                </span>
            </div>

            <div className="mt-6">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500">
                            Seats available
                        </p>
                        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                            {availableSeats}
                            <span className="ml-1 text-sm font-medium text-slate-400">
                                / {totalSeats}
                            </span>
                        </p>
                    </div>

                    <p className="text-xs font-medium text-slate-400">
                        {totalSeats > 0
                            ? Math.round(
                                  ((confirmedSeats + heldSeats) / safeTotal) *
                                      100
                              )
                            : 0}
                        % occupied
                    </p>
                </div>

                <div
                    className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
                    role="img"
                    aria-label={`${confirmedSeats} confirmed, ${heldSeats} on hold, ${availableSeats} available out of ${totalSeats} seats`}
                >
                    <div
                        className="h-full bg-slate-800"
                        style={{ width: `${confirmedWidth}%` }}
                    />
                    <div
                        className="h-full bg-amber-400"
                        style={{ width: `${heldWidth}%` }}
                    />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-800" />
                        {confirmedSeats} confirmed
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        {heldSeats} on hold
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-200" />
                        {availableSeats} open
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                <div>
                    <p className="text-[11px] text-slate-400">Capacity</p>
                    <p className="tabular text-sm font-semibold text-slate-700">
                        {totalSeats}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-400">On hold</p>
                    <p className="tabular text-sm font-semibold text-slate-700">
                        {heldSeats}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-400">Confirmed</p>
                    <p className="tabular text-sm font-semibold text-slate-700">
                        {confirmedSeats}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-1 flex-col justify-end">
                <button
                    type="button"
                    disabled={isFull || submitting}
                    onClick={handleApply}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isFull
                            ? "cursor-not-allowed bg-slate-100 text-slate-400"
                            : submitting
                                ? "cursor-wait bg-brand-400 text-white"
                                : "bg-brand-600 text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700 active:bg-brand-800"
                    }`}
                >
                    {submitting ? (
                        <>
                            <SpinnerIcon className="h-4 w-4" />
                            Reserving seat…
                        </>
                    ) : isFull ? (
                        "No seats available"
                    ) : (
                        <>
                            Reserve this seat
                            <ArrowRightIcon className="h-4 w-4" />
                        </>
                    )}
                </button>

                {!hasValidId && !isFull && (
                    <p className="mt-2 text-center text-xs text-slate-400">
                        Add your Student ID above to apply.
                    </p>
                )}

                {message && (
                    <div
                        role="status"
                        className="animate-fade mt-3 flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-left"
                    >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckIcon className="h-3 w-3" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold text-emerald-800">
                                Application submitted
                            </p>
                            <p className="mt-0.5 text-xs text-emerald-700">
                                {message}
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="animate-fade mt-3 flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-left"
                    >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                            <AlertIcon className="h-3 w-3" />
                        </span>
                        <p className="text-xs font-medium text-rose-700">
                            {error}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
}

export default ClassCard;
