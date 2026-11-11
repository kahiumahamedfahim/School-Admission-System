import { useEffect, useMemo, useState } from "react";
import { getMyHolds } from "../services/holdService";
import HoldCard from "../components/HoldCard";
import {
    AlertIcon,
    ClipboardIcon,
    IdIcon,
    RefreshIcon,
} from "../components/Icons";

function MyHolds({ studentId, classes = [], refreshKey, onHoldUpdated }) {
    const [holds, setHolds] = useState([]);
    const [loading, setLoading] = useState(Boolean(studentId));
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState("");
    const [reloadToken, setReloadToken] = useState(0);

    const classNames = useMemo(
        () => new Map(classes.map((schoolClass) => [schoolClass.id, schoolClass.name])),
        [classes]
    );

    useEffect(() => {
        if (!studentId) {
            return undefined;
        }

        let cancelled = false;

        const fetchHolds = async (showSpinner) => {
            if (showSpinner) {
                setLoading(true);
            }

            try {
                const data = await getMyHolds(studentId);

                if (!cancelled) {
                    setHolds(Array.isArray(data) ? data : []);
                    setError("");
                    setHasLoaded(true);
                }
            } catch (requestError) {
                console.error("Failed to load holds:", requestError);

                if (!cancelled) {
                    setError(
                        "We couldn't load your applications. Check your connection and try again."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchHolds(true);

        const intervalId = setInterval(() => fetchHolds(false), 5000);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [studentId, refreshKey, reloadToken]);

    const handleHoldUpdated = async () => {
        if (!studentId) {
            return;
        }

        try {
            const data = await getMyHolds(studentId);

            setHolds(Array.isArray(data) ? data : []);
            setHasLoaded(true);
            setError("");
        } catch (requestError) {
            console.error("Failed to refresh holds:", requestError);
        }

        onHoldUpdated?.();
    };

    const showSkeleton = loading && !hasLoaded && holds.length === 0;

    return (
        <section aria-labelledby="applications-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                        Your applications
                    </p>

                    <h2
                        id="applications-heading"
                        className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]"
                    >
                        Application history
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Track reserved seats, confirm your admission, or cancel
                        an application.
                    </p>
                </div>

                {studentId && hasLoaded && (
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                        <ClipboardIcon className="h-3.5 w-3.5 text-slate-400" />
                        {holds.length} application
                        {holds.length === 1 ? "" : "s"}
                    </span>
                )}
            </div>

            <div className="mt-6">
                {!studentId ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500">
                            <IdIcon className="h-6 w-6" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-900">
                            Your applications will appear here
                        </h3>

                        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
                            Enter your Student ID in the access card above to
                            view and manage your admission applications.
                        </p>
                    </div>
                ) : showSkeleton ? (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {[0, 1].map((index) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-slate-200 bg-white p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="w-2/3">
                                        <div className="shimmer h-3 w-24 rounded-full bg-slate-100" />
                                        <div className="shimmer mt-3 h-5 w-40 rounded-full bg-slate-100" />
                                    </div>

                                    <div className="shimmer h-6 w-20 rounded-full bg-slate-100" />
                                </div>

                                <div className="shimmer mt-6 h-24 w-full rounded-2xl bg-slate-100" />
                                <div className="mt-5 flex gap-3">
                                    <div className="shimmer h-10 flex-1 rounded-2xl bg-slate-100" />
                                    <div className="shimmer h-10 flex-1 rounded-2xl bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error && holds.length === 0 ? (
                    <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-6">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600">
                                <AlertIcon className="h-4 w-4" />
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-rose-900">
                                    Applications unavailable
                                </p>
                                <p className="mt-0.5 text-xs text-rose-700">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setReloadToken((value) => value + 1)
                                    }
                                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 transition hover:bg-rose-100"
                                >
                                    <RefreshIcon className="h-3.5 w-3.5" />
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                ) : holds.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                            <ClipboardIcon className="h-6 w-6" />
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-900">
                            No applications yet
                        </h3>

                        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
                            Choose an available class above and reserve a seat
                            to start your application.
                        </p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div
                                role="alert"
                                className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3"
                            >
                                <AlertIcon className="h-4 w-4 shrink-0 text-amber-500" />
                                <p className="text-xs font-medium text-amber-800">
                                    Live updates are paused. {error}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            {holds.map((hold) => (
                                <HoldCard
                                    key={hold.holdId}
                                    hold={hold}
                                    classLabel={
                                        classNames.get(hold.classId) ??
                                        "Admission class"
                                    }
                                    studentId={studentId}
                                    onUpdated={handleHoldUpdated}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default MyHolds;
