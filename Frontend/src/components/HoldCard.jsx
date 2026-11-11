import { useEffect, useRef, useState } from "react";
import { confirmHold, cancelHold } from "../services/holdService";
import {
    AlertIcon,
    CheckBadgeIcon,
    ClockIcon,
    SpinnerIcon,
    XIcon,
} from "./Icons";

function getRemainingSeconds(expiresAt) {
    const target = new Date(expiresAt).getTime();

    if (Number.isNaN(target)) {
        return 0;
    }

    return Math.max(0, Math.floor((target - Date.now()) / 1000));
}

function formatCountdown(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const statusConfig = {
    HELD: {
        label: "On hold",
        chip: "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
    },
    CONFIRMED: {
        label: "Confirmed",
        chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        dot: "bg-emerald-500",
    },
    EXPIRED: {
        label: "Expired",
        chip: "bg-rose-50 text-rose-700 ring-rose-200",
        dot: "bg-rose-500",
    },
    CANCELLED: {
        label: "Cancelled",
        chip: "bg-slate-100 text-slate-600 ring-slate-200",
        dot: "bg-slate-400",
    },
};

function HoldCard({ hold, classLabel, studentId, onUpdated }) {
    const [action, setAction] = useState(null);
    const [error, setError] = useState("");
    const [remaining, setRemaining] = useState(() =>
        getRemainingSeconds(hold.expiresAt)
    );
    const refreshedOnExpiry = useRef(false);

    const status = statusConfig[hold.status] ?? {
        label: hold.status,
        chip: "bg-slate-100 text-slate-600 ring-slate-200",
        dot: "bg-slate-400",
    };

    useEffect(() => {
        if (hold.status !== "HELD") {
            return undefined;
        }

        const intervalId = setInterval(() => {
            setRemaining(getRemainingSeconds(hold.expiresAt));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [hold.expiresAt, hold.status]);

    useEffect(() => {
        if (
            hold.status === "HELD" &&
            remaining === 0 &&
            !refreshedOnExpiry.current
        ) {
            refreshedOnExpiry.current = true;

            const timeoutId = setTimeout(() => onUpdated?.(), 1500);

            return () => clearTimeout(timeoutId);
        }

        return undefined;
    }, [hold.status, remaining, onUpdated]);

    const runAction = async (type, request) => {
        try {
            setAction(type);
            setError("");

            await request();

            onUpdated?.();
        } catch (requestError) {
            console.error(`Failed to ${type} hold:`, requestError);

            if (requestError.response?.data?.message) {
                setError(requestError.response.data.message);
            } else {
                setError(
                    type === "confirm"
                        ? "We couldn't confirm this application. Please try again."
                        : "We couldn't cancel this application. Please try again."
                );
            }
        } finally {
            setAction(null);
        }
    };

    const handleConfirm = () =>
        runAction("confirm", () => confirmHold(hold.holdId, studentId));

    const handleCancel = () =>
        runAction("cancel", () => cancelHold(hold.holdId, studentId));

    const isExpiredHold = hold.status === "HELD" && remaining === 0;
    const urgent = remaining > 0 && remaining <= 60;
    const reference = String(hold.holdId).slice(0, 8).toUpperCase();
    const classReference = String(hold.classId).slice(0, 8).toUpperCase();

    return (
        <article className="animate-rise flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Application #{reference}
                    </p>
                    <h3 className="mt-1 truncate text-lg font-bold tracking-tight text-slate-900">
                        {classLabel}
                    </h3>
                </div>

                <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${status.chip}`}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                </span>
            </div>

            <div className="mt-5 flex-1">
                {hold.status === "HELD" && !isExpiredHold && (
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
                                    <ClockIcon className="h-4.5 w-4.5" />
                                </span>

                                <div>
                                    <p className="text-sm font-semibold text-amber-900">
                                        Seat temporarily reserved
                                    </p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
                                        Confirm your admission before the
                                        countdown ends to keep this seat.
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                                    Time left
                                </p>
                                <p
                                    className={`tabular mt-0.5 text-2xl font-bold leading-none ${
                                        urgent
                                            ? "text-rose-600"
                                            : "text-amber-800"
                                    }`}
                                    aria-label={`${remaining} seconds remaining`}
                                >
                                    {formatCountdown(remaining)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isExpiredHold && (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600">
                                <ClockIcon className="h-4.5 w-4.5" />
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-rose-900">
                                    Hold time has run out
                                </p>
                                <p className="mt-0.5 text-xs leading-relaxed text-rose-700">
                                    The seat is being released. This
                                    application can no longer be confirmed.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {hold.status === "CONFIRMED" && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <div className="flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                                <CheckBadgeIcon className="h-5 w-5" />
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-emerald-900">
                                    Admission confirmed
                                </p>
                                <p className="mt-0.5 text-xs leading-relaxed text-emerald-700">
                                    Your seat is secured. The seat is no
                                    longer available to other students.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {hold.status === "EXPIRED" && (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600">
                                <XIcon className="h-4 w-4" />
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-rose-900">
                                    Reservation expired
                                </p>
                                <p className="mt-0.5 text-xs leading-relaxed text-rose-700">
                                    The hold was not confirmed in time, so the
                                    seat was returned to the class.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {hold.status === "CANCELLED" && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-500">
                                <XIcon className="h-4 w-4" />
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    Application cancelled
                                </p>
                                <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                                    You can apply for this or another class
                                    again at any time.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="animate-fade mt-3 flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3.5 py-3"
                    >
                        <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                        <p className="text-xs font-medium text-rose-700">
                            {error}
                        </p>
                    </div>
                )}
            </div>

            {hold.status === "HELD" && (
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={action !== null || isExpiredHold}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300 disabled:shadow-none"
                    >
                        {action === "confirm" ? (
                            <>
                                <SpinnerIcon className="h-4 w-4" />
                                Confirming…
                            </>
                        ) : (
                            "Confirm admission"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={action !== null}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {action === "cancel" ? (
                            <>
                                <SpinnerIcon className="h-4 w-4" />
                                Cancelling…
                            </>
                        ) : (
                            "Cancel"
                        )}
                    </button>
                </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                <span>
                    Class ref{" "}
                    <span className="tabular font-semibold text-slate-500">
                        {classReference}
                    </span>
                </span>

                {hold.status === "HELD" && !isExpiredHold && (
                    <span>
                        Expires{" "}
                        <span className="tabular font-semibold text-slate-500">
                            {new Date(hold.expiresAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </span>
                )}

                {hold.status === "CONFIRMED" && (
                    <span className="font-semibold text-emerald-600">
                        Seat secured
                    </span>
                )}
            </div>
        </article>
    );
}

export default HoldCard;
