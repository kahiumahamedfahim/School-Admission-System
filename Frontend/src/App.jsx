import { useCallback, useEffect, useMemo, useState } from "react";
import { getClasses } from "./services/classService";
import ClassList from "./components/ClassList";
import StudentIdInput from "./components/StudentIdInput";
import MyHolds from "./pages/MyHolds";
import Admin from "./pages/Admin";
import {
    AlertIcon,
    BuildingIcon,
    CapIcon,
    CheckIcon,
    ClockIcon,
    RefreshIcon,
    ShieldIcon,
    SparkIcon,
} from "./components/Icons";

const STUDENT_ID_PATTERN = /^\d{17}$/;

function Brand() {
    return (
        <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-lg shadow-brand-600/25">
                <CapIcon className="h-5 w-5" />
            </span>

            <div className="leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">
                    AdmissionHub
                </p>
                <p className="text-sm font-bold tracking-tight text-slate-900">
                    School Admission System
                </p>
            </div>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className="app-background min-h-screen">
            <header className="border-b border-slate-200/70 bg-white/80">
                <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
                    <Brand />
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-2">
                    <div>
                        <div className="shimmer h-6 w-44 rounded-full bg-slate-200/70" />
                        <div className="shimmer mt-6 h-11 w-full max-w-md rounded-2xl bg-slate-200/70" />
                        <div className="shimmer mt-3 h-11 w-2/3 rounded-2xl bg-slate-200/70" />
                        <div className="shimmer mt-6 h-4 w-full max-w-sm rounded-full bg-slate-200/60" />
                        <div className="shimmer mt-2 h-4 w-72 rounded-full bg-slate-200/60" />

                        <div className="mt-8 grid grid-cols-3 gap-3">
                            {[0, 1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="shimmer h-20 rounded-2xl bg-white"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="shimmer h-80 rounded-3xl bg-white" />
                </div>

                <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className="shimmer h-72 rounded-3xl bg-white"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ErrorScreen({ message, onRetry }) {
    return (
        <div className="app-background grid min-h-screen place-items-center px-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                    <AlertIcon className="h-6 w-6" />
                </div>

                <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
                    Admission service unavailable
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                >
                    <RefreshIcon className="h-4 w-4" />
                    Try again
                </button>

                <p className="mt-4 text-xs text-slate-400">
                    The portal also retries automatically every 5 seconds.
                </p>
            </div>
        </div>
    );
}

function App() {
    const [classes, setClasses] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [view, setView] = useState("student");
    const [refreshing, setRefreshing] = useState(false);

    const loadClasses = useCallback(async () => {
        try {
            const data = await getClasses();

            setError("");
            setClasses(Array.isArray(data) ? data : []);
            return true;
        } catch (requestError) {
            console.error("Failed to load classes:", requestError);
            setError(
                "We couldn't reach the admission service. Make sure the API is running, then try again."
            );
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialLoadId = setTimeout(loadClasses, 0);
        const intervalId = setInterval(loadClasses, 5000);

        return () => {
            clearTimeout(initialLoadId);
            clearInterval(intervalId);
        };
    }, [loadClasses]);

    const stats = useMemo(
        () =>
            classes.reduce(
                (accumulator, schoolClass) => {
                    const totalSeats = schoolClass.totalSeats ?? 0;
                    const heldSeats = schoolClass.heldSeats ?? 0;
                    const confirmedSeats = schoolClass.confirmedSeats ?? 0;

                    accumulator.classes += 1;
                    accumulator.seats += totalSeats;
                    accumulator.held += heldSeats;
                    accumulator.available +=
                        schoolClass.availableSeats ??
                        Math.max(0, totalSeats - heldSeats - confirmedSeats);

                    return accumulator;
                },
                { classes: 0, seats: 0, held: 0, available: 0 }
            ),
        [classes]
    );

    const isStudentIdValid = STUDENT_ID_PATTERN.test(studentId);
    const maskedStudentId = isStudentIdValid
        ? `${studentId.slice(0, 3)}…${studentId.slice(-4)}`
        : "";

    const handleHoldCreated = useCallback(async () => {
        await loadClasses();
        setRefreshKey((value) => value + 1);

        window.setTimeout(() => {
            document
                .getElementById("applications")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
    }, [loadClasses]);

    const handleManualRefresh = async () => {
        setRefreshing(true);

        try {
            await loadClasses();
        } finally {
            setRefreshing(false);
        }
    };

    const handleRetry = async () => {
        setLoading(true);
        await loadClasses();
    };

    const changeView = (nextView) => {
        setView(nextView);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading && classes.length === 0 && !error) {
        return <LoadingScreen />;
    }

    if (error && classes.length === 0) {
        return <ErrorScreen message={error} onRetry={handleRetry} />;
    }

    return (
        <div className="app-background min-h-screen">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
            >
                Skip to content
            </a>

            <header className="glass-panel sticky top-0 z-40 border-b border-slate-200/70">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
                    <Brand />

                    <nav
                        className="order-3 flex w-full gap-1 rounded-2xl bg-slate-100/90 p-1 sm:order-none sm:ml-auto sm:w-auto"
                        aria-label="Primary"
                    >
                        <button
                            type="button"
                            onClick={() => changeView("student")}
                            aria-current={view === "student" ? "page" : undefined}
                            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                                view === "student"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <CapIcon className="h-4 w-4" />
                            Student portal
                        </button>

                        <button
                            type="button"
                            onClick={() => changeView("admin")}
                            aria-current={view === "admin" ? "page" : undefined}
                            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                                view === "admin"
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <BuildingIcon className="h-4 w-4" />
                            Admin console
                        </button>
                    </nav>

                    <div className="ml-auto hidden items-center gap-2 lg:flex">
                        {isStudentIdValid ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                <ShieldIcon className="h-3.5 w-3.5" />
                                Student {maskedStudentId}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                Admission portal live
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {view === "student" ? (
                <>
                    <section className="relative overflow-hidden">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"
                        />

                        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-16 lg:pt-14">
                            <div className="animate-rise">
                                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-inset ring-brand-200">
                                    <SparkIcon className="h-3.5 w-3.5" />
                                    2026 intake · applications open
                                </span>

                                <h2 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-5xl">
                                    Find your class.
                                    <br />
                                    <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                        Hold your seat.
                                    </span>
                                </h2>

                                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                                    Browse admission classes, reserve a seat
                                    instantly, and confirm your place — all in
                                    one place.
                                </p>

                                <ul className="mt-6 space-y-2.5">
                                    {[
                                        "Reserve a seat in one click",
                                        "Hold stays valid for 10 minutes",
                                        "Confirm to lock in your admission",
                                    ].map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2.5 text-sm text-slate-600"
                                        >
                                            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                                                <CheckIcon className="h-3 w-3" />
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <dl className="mt-8 grid max-w-lg grid-cols-3 gap-3">
                                    {[
                                        {
                                            label: "Seats open",
                                            value: stats.available,
                                        },
                                        {
                                            label: "Classes",
                                            value: stats.classes,
                                        },
                                        {
                                            label: "On hold",
                                            value: stats.held,
                                        },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur"
                                        >
                                            <dt className="text-[11px] font-medium text-slate-500">
                                                {stat.label}
                                            </dt>
                                            <dd className="tabular mt-1 text-xl font-bold tracking-tight text-slate-900">
                                                {stat.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="animate-rise relative" style={{ animationDelay: "80ms" }}>
                                <div
                                    aria-hidden="true"
                                    className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-500/10 via-transparent to-sky-400/10 blur-xl"
                                />

                                <div className="relative rounded-3xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-brand-950/10 ring-1 ring-slate-900/5 backdrop-blur sm:p-7">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-bold tracking-tight text-slate-900">
                                                Student access
                                            </h3>
                                            <p className="mt-0.5 text-sm text-slate-500">
                                                Identify yourself to apply and
                                                manage holds.
                                            </p>
                                        </div>

                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                                            <ShieldIcon className="h-4.5 w-4.5" />
                                        </span>
                                    </div>

                                    <div className="mt-5">
                                        <StudentIdInput
                                            studentId={studentId}
                                            setStudentId={setStudentId}
                                        />
                                    </div>

                                    <div className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200/70">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            How it works
                                        </p>

                                        <ol className="mt-3 space-y-2.5">
                                            {[
                                                "Reserve a seat in an open class",
                                                "Confirm within 10 minutes",
                                                "Your admission is secured",
                                            ].map((step, index) => (
                                                <li
                                                    key={step}
                                                    className="flex items-center gap-2.5 text-xs text-slate-600"
                                                >
                                                    <span className="tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-bold text-brand-700 shadow-sm ring-1 ring-slate-200">
                                                        {index + 1}
                                                    </span>
                                                    {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                                        <ClockIcon className="h-3.5 w-3.5 shrink-0" />
                                        Unconfirmed holds are released
                                        automatically.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <main
                        id="main"
                        className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8"
                    >
                        {error && (
                            <div
                                role="alert"
                                className="mb-6 flex flex-col gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-start gap-2">
                                    <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                                    <p className="text-xs font-medium text-amber-800">
                                        {error} Showing the last known data.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleManualRefresh}
                                    className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-100"
                                >
                                    <RefreshIcon className="h-3.5 w-3.5" />
                                    Refresh
                                </button>
                            </div>
                        )}

                        <section
                            id="classes"
                            aria-labelledby="classes-heading"
                            className="scroll-mt-24"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                                        Available classes
                                    </p>

                                    <h2
                                        id="classes-heading"
                                        className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]"
                                    >
                                        Choose your class
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Seat availability updates live every few
                                        seconds.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                                        {stats.classes} class
                                        {stats.classes === 1 ? "" : "es"}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={handleManualRefresh}
                                        disabled={refreshing}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <RefreshIcon
                                            className={`h-3.5 w-3.5 ${
                                                refreshing ? "animate-spin" : ""
                                            }`}
                                        />
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6">
                                <ClassList
                                    key={studentId || "anonymous"}
                                    classes={classes}
                                    studentId={studentId}
                                    onHoldCreated={handleHoldCreated}
                                />
                            </div>
                        </section>

                        <div
                            id="applications"
                            className="mt-14 scroll-mt-24 lg:mt-16"
                        >
                            <MyHolds
                                key={studentId || "anonymous"}
                                studentId={studentId}
                                classes={classes}
                                refreshKey={refreshKey}
                                onHoldUpdated={loadClasses}
                            />
                        </div>
                    </main>
                </>
            ) : (
                <main
                    id="main"
                    className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8"
                >
                    {error && (
                        <div
                            role="alert"
                            className="mb-6 flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3"
                        >
                            <AlertIcon className="h-4 w-4 shrink-0 text-amber-500" />
                            <p className="text-xs font-medium text-amber-800">
                                {error} Showing the last known data.
                            </p>
                        </div>
                    )}

                    <Admin
                        classes={classes}
                        onClassesChanged={loadClasses}
                    />
                </main>
            )}

            <footer className="border-t border-slate-200/80 bg-white/70">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left lg:px-8">
                    <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-600 text-white">
                            <CapIcon className="h-3.5 w-3.5" />
                        </span>
                        <span>
                            School Admission System · 2026 intake
                        </span>
                    </div>

                    <p>Seat holds expire automatically after 10 minutes.</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
